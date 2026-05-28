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
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 14,
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
  },

  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },

  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    columnGap: 14,
  },

  cardTitleWrap: {
    flex: 1,
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },

  statusRow: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: 7,
    marginTop: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  statusText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: "800",
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },

  modifyText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  settingsGrid: {
    flexDirection: "row",
    columnGap: 16,
    marginBottom: 16,
  },

  settingBlock: {
    flex: 1,
  },

  metaLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 7,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  settingValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },

  interestChipText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },

  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 14,
  },

  avatarRow: {
    flexDirection: "row",
  },

  memberAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.surface,
    marginRight: -8,
    overflow: "hidden",
  },

  memberCountAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
    marginRight: -8,
  },

  memberCountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "900",
  },

  addAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },

  addAvatarWithMembers: {
    marginLeft: 0,
  },

  memberMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },

  budgetBlock: {
    flex: 1,
    alignItems: "flex-end",
  },

  budgetText: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
  },

  budgetSuffix: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "500",
  },

  dayHeader: {
    marginTop: 24,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
  },

  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },

  dayBadgeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  dayTitleWrap: {
    flex: 1,
  },

  dayTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },

  dayDate: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  timelineWrap: {
    position: "relative",
    paddingLeft: 15,
    rowGap: 28,
  },

  timelineLine: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#E2E8F0",
  },

  timeBlock: {
    position: "relative",
  },

  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginBottom: 14,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 1,
  },

  timeTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  timeText: {
    color: "#CBD5E1",
    fontWeight: "600",
  },

  activityCard: {
    marginLeft: 18,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  activityContent: {
    flexDirection: "row",
    columnGap: 13,
    marginBottom: 14,
  },

  imagePlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },

  activityInfo: {
    flex: 1,
  },

  activityTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 8,
  },

  activityTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },

  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 3,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },

  ratingText: {
    color: "#EA580C",
    fontSize: 10,
    fontWeight: "900",
  },

  activityDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  costRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },

  freePill: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  freePillText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "900",
  },

  splitButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    backgroundColor: "#F97316",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  splitButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },

  nearbyRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    flexWrap: "wrap",
  },

  nearbyLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  nearbyChip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  nearbyText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },

  transitPill: {
    alignSelf: "flex-start",
    marginLeft: 42,
    marginTop: 20,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 9,
  },

  transitText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "800",
  },

  transitCost: {
    color: "#818CF8",
    fontSize: 10,
    fontWeight: "700",
  },

  otherDays: {
    marginTop: 28,
    rowGap: 12,
  },

  dayPlaceholder: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 13,
    opacity: 0.82,
  },

  dayPlaceholderBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },

  dayPlaceholderText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "900",
  },

  dayPlaceholderInfo: {
    flex: 1,
  },

  dayPlaceholderTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },

  dayPlaceholderMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },
});

export default styles;
