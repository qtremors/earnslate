# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# kotlinx.serialization
-keepattributes *Annotation*, InnerClasses

# Keep `Companion` object fields of serializable classes.
-if @kotlinx.serialization.Serializable class **
-keepclassmembers class <1> {
    static <1>$Companion Companion;
}

# Keep `serializer()` on companion objects (both default and named) of serializable classes.
-if @kotlinx.serialization.Serializable class ** {
    static **$* *;
}
-keepclassmembers class <2>$<3> {
    kotlinx.serialization.KSerializer serializer(...);
}

# Keep `INSTANCE.serializer()` of serializable objects.
-if @kotlinx.serialization.Serializable class ** {
    public static ** INSTANCE;
}
-keepclassmembers class <1> {
    public kotlinx.serialization.KSerializer serializer(...);
}

# Keep `serializer()` on custom serializers.
-if @kotlinx.serialization.Serializer class **
-keepclassmembers class <1> {
    public kotlinx.serialization.KSerializer serializer(...);
}

# Keep all @Serializable data classes
-keep class dev.qtremors.earnslate.** implements kotlinx.serialization.KSerializer { *; }
-keep @kotlinx.serialization.Serializable class dev.qtremors.earnslate.** { *; }