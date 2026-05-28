import { StyleSheet } from "react-native";
import { colors } from "../common/colors";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  scrollContent: {
    paddingBottom: 118,
  },

  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  featuredImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 29,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: colors.surfaceMuted,
  },

  featuredImageRadius: {
    borderRadius: 29,
  },

  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)",
  },

  featuredInfo: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },

  featuredBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 8,
  },

  featuredBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  featuredTripTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    marginTop: 4,
  },

  featuredMetaText: {
    flex: 1,
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    fontWeight: "700",
  },

  featuredActions: {
    flexDirection: "row",
    columnGap: 12,
    padding: 4,
  },

  featuredPrimaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },

  featuredSecondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  featuredPrimaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  featuredSecondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "800",
  },

  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    columnGap: 14,
  },

  draftCard: {
    width: 160,
  },

  draftImage: {
    width: "100%",
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    justifyContent: "space-between",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.24)",
  },

  draftBadge: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  draftBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  draftInfo: {
    padding: 12,
  },

  draftTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "800",
  },

  draftCountry: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 12,
    fontWeight: "600",
  },

  editedText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  createCard: {
    width: 160,
  },

  createBox: {
    width: "100%",
    aspectRatio: 0.75,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  createIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  createText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  tabsWrap: {
    marginHorizontal: 16,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    padding: 4,
    flexDirection: "row",
  },

  tabButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },

  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },

  activeTabText: {
    color: colors.textPrimary,
    fontWeight: "800",
  },

  tripList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    rowGap: 12,
  },

  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  tripCardMuted: {
    opacity: 0.72,
  },

  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },

  tripContent: {
    flex: 1,
    minHeight: 80,
    justifyContent: "space-between",
  },

  tripTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },

  tripDate: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  collaboratorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  avatar: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: "#CBD5E1",
    marginRight: -8,
  },

  moreAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },

  moreAvatarText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "800",
  },

  collaboratorText: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 8,
  },

  tripActions: {
    rowGap: 8,
  },

  holdBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#FFEDD5",
  },

  holdBadgeText: {
    color: "#C2410C",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  aiBannerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  aiBanner: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,174,239,0.22)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
  },

  aiIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  aiTextWrap: {
    flex: 1,
  },

  aiTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },

  aiSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  reviewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
  },

  reviewButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
});

export default styles;
