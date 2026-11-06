package com.mirinetic.tvhome

import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageInstaller
import android.net.Uri
import android.os.Build
import android.provider.Settings
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * In-app update. The build workflow publishes TVHome.apk and version.json to the "tvhome-latest" release
 * (works while the repository is public); this compares versions and installs the new APK over this one.
 * Results reach the page as a 'tvhome-update' window event.
 */
class Updater(private val activity: MainActivity) {

    companion object {
        const val BASE = "https://github.com/mirinetic/TV-Home/releases/download/tvhome-latest/"
        const val ACTION_STATUS = "com.mirinetic.tvhome.INSTALL_STATUS"
    }

    private val worker = Executors.newSingleThreadExecutor()

    private fun send(obj: JSONObject) = activity.event("tvhome-update", obj.toString())

    fun check() {
        worker.execute {
            val result = JSONObject().put("type", "result")
            try {
                val info = JSONObject(open(BASE + "version.json").inputStream.use { it.readBytes().toString(Charsets.UTF_8) })
                val latest = info.getInt("versionCode")
                result.put("ok", true)
                    .put("current", BuildConfig.VERSION_CODE)
                    .put("currentName", BuildConfig.VERSION_NAME)
                    .put("latest", latest)
                    .put("latestName", info.optString("versionName"))
                    .put("notes", info.optString("notes"))
                    .put("available", latest > BuildConfig.VERSION_CODE)
            } catch (e: Exception) {
                result.put("ok", false).put("error", e.javaClass.simpleName).put("currentName", BuildConfig.VERSION_NAME)
            }
            send(result)
        }
    }

    private fun progress(phase: String) = send(JSONObject().put("type", "progress").put("phase", phase))

    fun install() {
        worker.execute {
            try {
                if (Build.VERSION.SDK_INT >= 26 && !activity.packageManager.canRequestPackageInstalls()) {
                    activity.runOnUiThread {
                        try {
                            activity.startActivity(
                                Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:${activity.packageName}"))
                                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            )
                        } catch (_: Exception) {
                        }
                    }
                    progress("permission")
                    return@execute
                }
                progress("download")
                val installer = activity.packageManager.packageInstaller
                val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
                val sessionId = installer.createSession(params)
                installer.openSession(sessionId).use { session ->
                    open(BASE + "TVHome.apk").inputStream.use { input ->
                        session.openWrite("tvhome.apk", 0, -1).use { out ->
                            input.copyTo(out)
                            session.fsync(out)
                        }
                    }
                    val status = Intent(ACTION_STATUS).setPackage(activity.packageName)
                    val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                        (if (Build.VERSION.SDK_INT >= 31) PendingIntent.FLAG_MUTABLE else 0)
                    session.commit(PendingIntent.getBroadcast(activity, sessionId, status, flags).intentSender)
                }
                progress("confirm")
            } catch (e: Exception) {
                progress("error")
            }
        }
    }

    /** Called by MainActivity when the installer reports back. */
    fun onStatus(intent: Intent) {
        when (intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)) {
            PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                val confirm: Intent? = if (Build.VERSION.SDK_INT >= 33) {
                    intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableExtra(Intent.EXTRA_INTENT)
                }
                confirm?.let {
                    it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    try {
                        activity.startActivity(it)
                    } catch (_: Exception) {
                        progress("error")
                    }
                }
            }
            PackageInstaller.STATUS_SUCCESS -> Unit // the new version replaces this process
            PackageInstaller.STATUS_FAILURE_ABORTED -> progress("cancelled")
            else -> progress("error")
        }
    }

    private fun open(url: String): HttpURLConnection {
        val conn = URL(url).openConnection() as HttpURLConnection
        conn.connectTimeout = 15_000
        conn.readTimeout = 60_000
        conn.instanceFollowRedirects = true
        conn.setRequestProperty("Cache-Control", "no-cache")
        if (conn.responseCode !in 200..299) throw IllegalStateException("HTTP ${conn.responseCode}")
        return conn
    }
}
