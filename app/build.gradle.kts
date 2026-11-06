plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val buildNumber = System.getenv("GITHUB_RUN_NUMBER")?.toIntOrNull() ?: 1

android {
    namespace = "com.mirinetic.tvhome"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mirinetic.tvhome"
        minSdk = 24
        targetSdk = 35
        versionCode = buildNumber
        versionName = "1.0.$buildNumber"
    }

    // A fixed personal key so every build installs over the previous one. Sideloading on your own TV only.
    signingConfigs {
        create("personal") {
            storeFile = rootProject.file("keystore/tvhome-personal.jks")
            storePassword = "tvhome-personal"
            keyAlias = "tvhome"
            keyPassword = "tvhome-personal"
        }
    }

    buildTypes {
        getByName("debug") { signingConfig = signingConfigs.getByName("personal") }
        getByName("release") {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("personal")
        }
    }

    // The web UI (web/dist, built by the workflow) is packed as assets/www.
    sourceSets["main"].assets.srcDirs("src/main/assets", "build/generated/webAssets")

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    lint {
        checkReleaseBuilds = false
        abortOnError = false
    }
}

// Copies the built web UI into the APK's assets (run `npm run build` in web/ first).
val copyWeb by tasks.registering(Copy::class) {
    from(rootProject.file("web/dist"))
    into(layout.buildDirectory.dir("generated/webAssets/www"))
}
tasks.named("preBuild") { dependsOn(copyWeb) }
