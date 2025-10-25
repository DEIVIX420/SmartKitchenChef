import { useRecipe } from "@/contexts/RecipeContext";
import Colors from "@/constants/colors";
import { DIETARY_PREFERENCES } from "@/constants/ingredients";
import { Shield, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { dietaryPreferences, updateDietaryPreferences, ingredients, favoriteRecipes } =
    useRecipe();
  const [showDietaryModal, setShowDietaryModal] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleDietaryPreference = (id: string) => {
    if (dietaryPreferences.includes(id)) {
      updateDietaryPreferences(dietaryPreferences.filter((p) => p !== id));
    } else {
      updateDietaryPreferences([...dietaryPreferences, id]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Statistics
          </Text>
          <View
            style={[styles.card, { backgroundColor: colors.cardBackground }]}
          >
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Ingredients in pantry
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {ingredients.length}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Favorite recipes
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {favoriteRecipes.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dietary Preferences
          </Text>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.cardBackground }]}
            onPress={() => setShowDietaryModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Manage preferences
              </Text>
              <View style={styles.settingRight}>
                {dietaryPreferences.length > 0 && (
                  <Text
                    style={[
                      styles.settingValue,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {dietaryPreferences.length} selected
                  </Text>
                )}
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </View>
          </TouchableOpacity>

          {dietaryPreferences.length > 0 && (
            <View style={styles.chipContainer}>
              {dietaryPreferences.map((prefId) => {
                const pref = DIETARY_PREFERENCES.find((p) => p.id === prefId);
                if (!pref) return null;
                return (
                  <View
                    key={pref.id}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.cardBackground },
                    ]}
                  >
                    <Text style={styles.chipEmoji}>{pref.emoji}</Text>
                    <Text style={[styles.chipText, { color: colors.text }]}>
                      {pref.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy & Data
          </Text>
          <View
            style={[styles.card, { backgroundColor: colors.cardBackground }]}
          >
            <View style={styles.privacyContent}>
              <Shield size={24} color={colors.accent} strokeWidth={2} />
              <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
                Your data is stored locally on your device and only used to
                generate personalized recipe suggestions. We do not share or sell
                your information to third parties. AI-generated recipes are
                created in real-time and not stored externally.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Chef AI • Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showDietaryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDietaryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDietaryModal(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Dietary Preferences
              </Text>
              <TouchableOpacity onPress={() => setShowDietaryModal(false)}>
                <Text style={[styles.modalDone, { color: colors.tint }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {DIETARY_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref.id}
                  style={[
                    styles.preferenceItem,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => toggleDietaryPreference(pref.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.preferenceLeft}>
                    <Text style={styles.preferenceEmoji}>{pref.emoji}</Text>
                    <Text style={[styles.preferenceLabel, { color: colors.text }]}>
                      {pref.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: dietaryPreferences.includes(pref.id)
                          ? colors.tint
                          : "transparent",
                        borderColor: dietaryPreferences.includes(pref.id)
                          ? colors.tint
                          : colors.border,
                      },
                    ]}
                  >
                    {dietaryPreferences.includes(pref.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  privacyContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  modalScroll: {
    maxHeight: 500,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preferenceEmoji: {
    fontSize: 24,
  },
  preferenceLabel: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
  },
});
