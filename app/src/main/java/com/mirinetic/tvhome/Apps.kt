package com.mirinetic.tvhome

import android.content.Context
import android.content.Intent

/** Finds the installed TV app behind a tile name. */
object Apps {
    // Known Android TV / Google TV packages for the prototype's tiles, in order of preference.
    private val KNOWN = mapOf(
        "netflix" to listOf("com.netflix.ninja", "com.netflix.mediaclient"),
        "primevideo" to listOf("com.amazon.amazonvideo.livingroom", "com.amazon.avod.thirdpartyclient"),
        "disney+" to listOf("com.disney.disneyplus"),
        "hulu" to listOf("com.hulu.livingroomplus", "com.hulu.plus"),
        "appletv" to listOf("com.apple.atve.androidtv.appletv", "com.apple.atve.amazon.appletv"),
        "youtube" to listOf("com.google.android.youtube.tv", "com.google.android.youtube"),
        "hbomax" to listOf("com.wbd.stream", "com.hbo.hbonow", "com.hbo.go"),
        "internet" to listOf("com.android.chrome", "org.mozilla.tv.firefox", "com.opera.browser", "com.cloudmosa.puffinTV"),
        "googleplay" to listOf("com.android.vending"),
        "livetv" to listOf("com.google.android.tv", "com.google.android.apps.tv.launcherx", "com.android.tv")
    )

    private fun norm(s: String) = s.lowercase().replace(Regex("[\\s._-]"), "")

    /** Package names of the apps that can be opened, with their labels. */
    private fun installed(ctx: Context): Map<String, String> {
        val pm = ctx.packageManager
        val out = LinkedHashMap<String, String>()
        for (cat in listOf(Intent.CATEGORY_LEANBACK_LAUNCHER, Intent.CATEGORY_LAUNCHER)) {
            val q = Intent(Intent.ACTION_MAIN).addCategory(cat)
            for (ri in pm.queryIntentActivities(q, 0)) {
                val pkg = ri.activityInfo.packageName
                if (pkg != ctx.packageName && pkg !in out) out[pkg] = ri.loadLabel(pm).toString()
            }
        }
        return out
    }

    fun find(ctx: Context, name: String): String? {
        val key = norm(name)
        if (key.isEmpty()) return null
        val apps = installed(ctx)
        KNOWN[key]?.firstOrNull { it in apps }?.let { return it }
        // otherwise an installed app whose label matches the tile name
        apps.entries.firstOrNull { norm(it.value) == key }?.let { return it.key }
        return apps.entries.firstOrNull { norm(it.value).startsWith(key) || key.startsWith(norm(it.value)) && norm(it.value).length >= 4 }?.key
    }

    /** Every app that can be opened, as JSON [{pkg, label}], sorted by label. */
    fun listJson(ctx: Context): String {
        val arr = org.json.JSONArray()
        installed(ctx).entries.sortedBy { it.value.lowercase() }.forEach {
            arr.put(org.json.JSONObject().put("pkg", it.key).put("label", it.value))
        }
        return arr.toString()
    }

    /** PNG of an app's TV banner (or its icon when it has none), or null. */
    fun imagePng(ctx: Context, pkg: String): ByteArray? {
        val pm = ctx.packageManager
        val d = try {
            val info = pm.getApplicationInfo(pkg, 0)
            info.loadBanner(pm) ?: pm.getApplicationBanner(pkg) ?: info.loadIcon(pm)
        } catch (_: Exception) {
            null
        } ?: return null
        val isBanner = d.intrinsicWidth > d.intrinsicHeight * 1.3
        val (w, h) = if (isBanner) 480 to 270 else 256 to 256
        val bmp = android.graphics.Bitmap.createBitmap(w, h, android.graphics.Bitmap.Config.ARGB_8888)
        d.setBounds(0, 0, w, h)
        d.draw(android.graphics.Canvas(bmp))
        val out = java.io.ByteArrayOutputStream()
        bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, out)
        return out.toByteArray()
    }

    fun launchIntent(ctx: Context, pkg: String): Intent? {
        val pm = ctx.packageManager
        return (pm.getLeanbackLaunchIntentForPackage(pkg) ?: pm.getLaunchIntentForPackage(pkg))
            ?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
}
