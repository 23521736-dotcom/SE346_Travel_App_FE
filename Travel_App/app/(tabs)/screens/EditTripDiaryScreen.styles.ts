import { StyleSheet } from "react-native";
import { colors } from "../common/colors";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  headerTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "800",
  },

  saveHeaderButton: {
    minWidth: 52,
    minHeight: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
  },

  saveHeaderText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 38,
    rowGap: 18,
  },

  tripInfoCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    flexDirection: "row",
    columnGap: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  infoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  infoTextWrap: {
    flex: 1,
  },

  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },

  placeName: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "800",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    marginTop: 8,
  },

  timeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },

  sectionMeta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
  },

  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  addPhotoTile: {
    width: "31.5%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primary,
    backgroundColor: "#EFF9FE",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 6,
  },

  addPhotoText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },

  photoTile: {
    width: "31.5%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },

  photoImage: {
    width: "100%",
    height: "100%",
  },

  removePhotoButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  captionCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
  },

  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 7,
    marginTop: 12,
  },

  singleLineInput: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },

  webDateInputWrap: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    justifyContent: "center",
  },

  captionHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginBottom: 12,
  },

  captionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },

  captionInput: {
    minHeight: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: "#F8FAFC",
    padding: 14,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },

  saveButton: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },

  saveButtonDisabled: {
    opacity: 0.62,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
});

export default styles;
