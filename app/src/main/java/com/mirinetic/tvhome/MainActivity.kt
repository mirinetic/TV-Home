package com.mirinetic.tvhome

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import java.io.IOException

/**
 * Hosts the TV Home web UI (bundled in assets/www) full screen.
 * The remote's arrows and OK reach the page as ArrowUp/Down/Left/Right and Enter (WebView does that);
 * Back is sent as Escape so the page decides what it closes. App tiles open the real TV apps through [Native].
 */
class MainActivity : Activity() {

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.mediaPlaybackRequiresUserGesture = false
            isFocusable = true
            isFocusableInTouchMode = true
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                    if (request.url.host == HOST) asset(request.url) else null

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
                    request.url.host != HOST
            }
            addJavascriptInterface(Native(), "TVHomeNative")
        }
        setContentView(web)
        hideSystemUi()
        web.loadUrl("https://$HOST/index.html")
        web.requestFocus()
    }

    /** Serves a file from assets/www; unknown paths get index.html (single-page app). */
    private fun asset(url: Uri): WebResourceResponse {
        var path = (url.path ?: "/").trimStart('/').ifEmpty { "index.html" }
        if (path.contains("..")) path = "index.html"
        val stream = try {
            assets.open("www/$path")
        } catch (e: IOException) {
            path = "index.html"
            assets.open("www/index.html")
        }
        val mime = when (path.substringAfterLast('.', "").lowercase()) {
            "html" -> "text/html"
            "js", "mjs" -> "text/javascript"
            "css" -> "text/css"
            "json" -> "application/json"
            "svg" -> "image/svg+xml"
            "webp" -> "image/webp"
            "png" -> "image/png"
            "jpg", "jpeg" -> "image/jpeg"
            "gif" -> "image/gif"
            "woff2" -> "font/woff2"
            "mp4" -> "video/mp4"
            else -> "application/octet-stream"
        }
        return WebResourceResponse(mime, if (mime.startsWith("text/") || mime.endsWith("json") || mime.endsWith("xml")) "utf-8" else null, stream)
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (event.keyCode == KeyEvent.KEYCODE_BACK || event.keyCode == KeyEvent.KEYCODE_BUTTON_B) {
            val type = if (event.action == KeyEvent.ACTION_DOWN) "keydown" else "keyup"
            web.evaluateJavascript(
                "window.dispatchEvent(new KeyboardEvent('$type',{key:'Escape',code:'Escape',keyCode:27,bubbles:true}))", null
            )
            return true
        }
        return super.dispatchKeyEvent(event)
    }

    override fun onResume() {
        super.onResume()
        hideSystemUi()
        if (::web.isInitialized) web.onResume()
    }

    override fun onPause() {
        if (::web.isInitialized) web.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }

    @Suppress("DEPRECATION")
    private fun hideSystemUi() {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE)
    }

    /** What the page may ask of the TV. */
    inner class Native {
        /** Opens the TV app for a tile name ("Netflix", "YouTube" ...). False when no such app is installed. */
        @JavascriptInterface
        fun launchApp(name: String): Boolean {
            val pkg = Apps.find(this@MainActivity, name) ?: return false
            val intent = Apps.launchIntent(this@MainActivity, pkg) ?: return false
            runOnUiThread {
                try {
                    startActivity(intent)
                } catch (_: Exception) {
                }
            }
            return true
        }

        /** True when a TV app for this tile name is installed. */
        @JavascriptInterface
        fun hasApp(name: String): Boolean = Apps.find(this@MainActivity, name) != null

        /** Leaves TV Home (back to the TV's own home screen). */
        @JavascriptInterface
        fun exit() {
            runOnUiThread { moveTaskToBack(true) }
        }
    }

    companion object {
        const val HOST = "tvhome.local"
    }
}
