import { StyleSheet } from "react-native";
import { colors } from "../../common/colors";
import { commonStyles } from "../../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
  },

  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  tabsWrap: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E5EEFF",
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
    color: "#3E4850",
    fontSize: 14,
    fontWeight: "700",
  },

  activeTabText: {
    color: colors.primary,
    fontWeight: "800",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 128,
    rowGap: 14,
  },

  statusWrap: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
  },

  statusText: {
    color: "#3E4850",
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
    color: "#6E7881",
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
    backgroundColor: "#EFF6FF",
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
    backgroundColor: "rgba(0,174,239,0.12)",
  },

  iconCircleSecondary: {
    backgroundColor: "#DBE4EA",
  },

  iconCircleTertiary: {
    backgroundColor: "rgba(245,158,11,0.14)",
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
    color: "#6E7881",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  descriptionText: {
    color: "#3E4850",
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
    borderColor: "#6E7881",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  declineButtonText: {
    color: "#3E4850",
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

export default styles;
