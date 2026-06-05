import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceMuted,
  },

  headerTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: "800",
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  tabsWrap: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    padding: 4,
    flexDirection: "row",
  },

  tabButton: {
    flex: 1,
    borderRadius: 9,
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
    color: colors.primary,
    fontWeight: "800",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 112,
    rowGap: 14,
  },

  statusWrap: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
  },

  statusText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  retryButton: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 48,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  swipeAction: {
    width: 104,
    marginLeft: 8,
    borderRadius: 14,
    overflow: "hidden",
  },

  deleteAction: {
    flex: 1,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,
  },

  deleteActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },

  readCard: {
    backgroundColor: colors.surface,
  },

  unreadCard: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  cardPressArea: {
    flexDirection: "row",
    columnGap: 14,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  iconCirclePrimary: {
    backgroundColor: colors.primaryLight,
  },

  iconCircleSecondary: {
    backgroundColor: colors.surfaceMuted,
  },

  iconCircleTertiary: {
    backgroundColor: colors.warningSoft,
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 8,
  },

  cardTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },

  highlightText: {
    color: colors.primary,
  },

  timeText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  descriptionText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: "row",
    columnGap: 8,
    marginTop: 12,
    marginLeft: 62,
  },

  acceptButton: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  acceptButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  declineButton: {
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  declineButtonText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },

  previewImage: {
    width: "100%",
    height: 132,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: colors.surfaceMuted,
  },
});

export default getStyles;
