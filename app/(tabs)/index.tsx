import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const featureCards = [
  {
    title: "PhotonFusion Camera",
    description: "1-inch sensor with cinematic color science and AI-assisted night depth mapping.",
  },
  {
    title: "LUMINA Neural Engine",
    description: "On-device intelligence for instant translation, visual search, and adaptive power tuning.",
  },
  {
    title: "Aurora Battery",
    description: "48-hour smart endurance with 65W hypercharge and cryo-cooling thermal layers.",
  },
];

const osPanels = [
  "Adaptive holographic widgets",
  "Immersive lock-screen depth scenes",
  "Gesture-first multitasking and fluid transitions",
];

const lifestyleRows = [
  "Studio portrait mode in low light",
  "Spatial audio for travel and focus",
  "Precision-machined titanium frame",
];

export default function LuminaLandingScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isPressed, setIsPressed] = useState(false);

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [0, -120],
    extrapolate: "clamp",
  });

  const glowOpacity = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [1, 0.25],
    extrapolate: "clamp",
  });

  const cardRotateX = tilt.y.interpolate({
    inputRange: [-20, 0, 20],
    outputRange: ["8deg", "0deg", "-8deg"],
  });

  const cardRotateY = tilt.x.interpolate({
    inputRange: [-20, 0, 20],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const heroTitle = useMemo(() => "LUMINA X1 • LUMINA Pods", []);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(tilt, {
      toValue: { x: 15, y: -12 },
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(tilt, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: "#05050A" }]}> 
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 64 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#07070D", "#0B1020", "#05050A"]}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View
            style={[
              styles.heroOrb,
              {
                opacity: glowOpacity,
                transform: [{ translateY: heroTranslateY }],
              },
            ]}
          />

          <Text style={styles.kicker}>LUMINA TECH · 2026 COLLECTION</Text>
          <Text style={styles.heroTitle}>{heroTitle}</Text>
          <Text style={styles.heroSubtitle}>
            Ultra-modern design. Cinematic capture. Spatial sound in a single premium ecosystem.
          </Text>

          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
              style={[
                styles.renderCard,
                {
                  transform: [
                    { perspective: 900 },
                    { rotateX: cardRotateX },
                    { rotateY: cardRotateY },
                    { scale: isPressed ? 1.02 : 1 },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={["#1B2038", "#0A0D17", "#161A2B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.phoneBody}
              >
                <View style={styles.cameraModule} />
                <View style={styles.phoneGlow} />
                <Text style={styles.deviceLabel}>LUMINA X1</Text>
              </LinearGradient>
              <View style={styles.podsWrap}>
                <View style={styles.pod} />
                <View style={[styles.pod, styles.podSecondary]} />
                <Text style={styles.deviceLabel}>LUMINA Pods</Text>
              </View>
            </Animated.View>
          </Pressable>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flagship Features</Text>
          {featureCards.map((item) => (
            <View key={item.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LUMINA OS Preview</Text>
          <View style={styles.osPreviewWrap}>
            {osPanels.map((panel) => (
              <View key={panel} style={styles.osPanel}>
                <LinearGradient colors={["#00E7FF22", "#8A5CFF33"]} style={styles.osGradient}>
                  <Text style={styles.osText}>{panel}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle · Shot on LUMINA</Text>
          {lifestyleRows.map((shot) => (
            <View key={shot} style={styles.lifestyleShot}>
              <LinearGradient colors={["#161A2B", "#0A0D17"]} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.lifestyleText}>{shot}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Packaging</Text>
          <View style={styles.packagingScene}>
            <Animated.View
              style={[
                styles.packageBox,
                {
                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [300, 900],
                        outputRange: [24, -18],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.packagingCopy}>
              Matte obsidian box, magnetic reveal, laser-etched branding, and modular accessory trays.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
        <Text style={[styles.ctaText, { color: colors.text }]}>Pre-order opens in 03:12:45</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  hero: {
    minHeight: 760,
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  heroOrb: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 999,
    backgroundColor: "#00EAFF1A",
    shadowColor: "#00E7FF",
    shadowOpacity: 0.65,
    shadowRadius: 60,
  },
  kicker: {
    color: "#7D8CB4",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 16,
  },
  heroTitle: {
    color: "#F5F7FF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: 14,
    lineHeight: 48,
  },
  heroSubtitle: {
    color: "#B8C0DF",
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
    maxWidth: 540,
  },
  renderCard: {
    marginTop: 28,
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: "#56CFFF44",
    backgroundColor: "#0A0F20",
    shadowColor: "#00E7FF",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
  },
  phoneBody: {
    borderRadius: 24,
    height: Platform.OS === "web" ? 330 : 300,
    justifyContent: "flex-end",
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#A9BFFF22",
  },
  cameraModule: {
    position: "absolute",
    top: 20,
    right: 18,
    width: 74,
    height: 74,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FFFFFF35",
    backgroundColor: "#101728",
  },
  phoneGlow: {
    position: "absolute",
    left: -20,
    bottom: -30,
    width: 220,
    height: 120,
    borderRadius: 120,
    backgroundColor: "#72F0FF44",
  },
  podsWrap: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pod: {
    width: 54,
    height: 82,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF22",
    backgroundColor: "#F7FAFF",
  },
  podSecondary: {
    backgroundColor: "#DDE3F2",
    transform: [{ rotate: "8deg" }],
  },
  deviceLabel: {
    color: "#EAF1FF",
    fontWeight: "700",
    marginLeft: "auto",
    letterSpacing: 1.1,
  },
  section: {
    paddingHorizontal: 22,
    marginTop: 26,
  },
  sectionTitle: {
    color: "#EDF2FF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 14,
  },
  featureCard: {
    backgroundColor: "#0D1222",
    borderWidth: 1,
    borderColor: "#7A9AFF33",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  featureTitle: {
    color: "#F6F8FF",
    fontSize: 18,
    fontWeight: "700",
  },
  featureDescription: {
    color: "#A9B8DF",
    marginTop: 8,
    lineHeight: 22,
  },
  osPreviewWrap: {
    gap: 10,
  },
  osPanel: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#7AE7FF44",
  },
  osGradient: {
    padding: 16,
    minHeight: 88,
    justifyContent: "center",
  },
  osText: {
    color: "#E8EEFF",
    fontWeight: "600",
    fontSize: 16,
  },
  lifestyleShot: {
    height: 170,
    borderRadius: 24,
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFFFFF1A",
  },
  lifestyleText: {
    color: "#EEF2FF",
    fontSize: 17,
    fontWeight: "600",
  },
  packagingScene: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#A9BFFF33",
    backgroundColor: "#090D17",
    padding: 18,
  },
  packageBox: {
    height: 170,
    borderRadius: 20,
    backgroundColor: "#13192A",
    borderWidth: 1,
    borderColor: "#E6EDFF22",
    marginBottom: 14,
    shadowColor: "#8A5CFF",
    shadowOpacity: 0.38,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  packagingCopy: {
    color: "#B1BFDD",
    lineHeight: 22,
  },
  ctaBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#070A14E6",
    borderTopWidth: 1,
    borderColor: "#73E9FF33",
  },
  ctaText: {
    fontWeight: "700",
    letterSpacing: 0.7,
    color: "#EEF2FF",
  },
});
