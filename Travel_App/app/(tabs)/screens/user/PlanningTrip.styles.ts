import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 42, paddingBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  headerEditButton: {
    minWidth: 64,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },
  headerEditText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 56 },

  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginRight: 12 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionPill: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
    backgroundColor: colors.primaryLight,
  },
  actionPillDanger: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
    backgroundColor: colors.dangerSoft,
  },
  actionButtonDisabled: {
    opacity: 0.65,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  modifyBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
  deleteTripText: { color: colors.danger, fontWeight: 'bold', fontSize: 13 },
  infoGrid: { flexDirection: 'row', columnGap: 14, marginBottom: 14 },
  infoCol: { flex: 1 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 6, fontWeight: '600' },
  iconRow: { flexDirection: 'row', alignItems: 'center', columnGap: 7 },
  infoValue: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  dateRangeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
  bottomSettingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', columnGap: 14, marginTop: 2 },

  avatarGroup: { flexDirection: 'row', alignItems: 'center', minHeight: 36, paddingLeft: 0, marginTop: 2 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.surfaceMuted,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMoreText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  emptyMembersText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 8,
    maxWidth: 120,
    fontStyle: 'italic',
  },
  avatarPlus: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceMuted, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.surface },
  budgetAmount: { fontSize: 17, fontWeight: 'bold', color: colors.primary, textAlign: 'right' },
  budgetUnit: { fontSize: 12, color: colors.textMuted, fontWeight: 'normal' },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },

  dayBadge: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  dayBadgeText: { color: colors.white, fontWeight: 'bold', fontSize: 18 },

  dayTitleCol: { flex: 1, marginLeft: 14, marginRight: 10 },
  dayTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  daySubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    marginBottom: 24,
  },

  scheduleDayHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  scheduleDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  scheduleDayDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  dayContainer: {
    marginBottom: 24,
  },

  itineraryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  itineraryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  itineraryInfo: {
    flex: 1,
  },

  itineraryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  itineraryRating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 2,
  },

  itineraryDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },

  costDetailBlock: {
    marginLeft: 20,
  },

  detailLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  deleteBtn: {
    padding: 8,
  },

  addLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 4,
  },

  addLocationIcon: {
    marginRight: 8,
  },

  addLocationText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },

  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  budgetIconContainer: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  budgetInfo: {
    flex: 1,
  },

  budgetCardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  budgetCurrency: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  timelineDay: {
    marginBottom: 12,
  },

  dayHeaderExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 8,
    paddingRight: 2,
    marginBottom: 6,
  },

  dayHeaderCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 14,
    paddingRight: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  dayBadgeExpanded: {
    backgroundColor: colors.primary,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayBadgeCollapsed: {
    backgroundColor: colors.primary,
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayBadgeTextExpanded: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 14,
  },

  dayBadgeTextCollapsed: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
  },

  dayTitleExpanded: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },

  dayTitleCollapsed: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },

  timelineWrap: {
    position: 'relative',
    paddingLeft: 14,
    marginLeft: 14,
    paddingBottom: 6,
  },

  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 8,
    width: 1,
    backgroundColor: colors.border,
  },

  timelineItem: {
    marginBottom: 14,
  },

  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: -14,
    paddingRight: 8,
  },

  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    marginRight: 10,
  },

  timeTitle: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  timeText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },

  timelineCard: {
    marginLeft: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  timelineImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  timelineInfo: {
    flex: 1,
    minWidth: 0,
  },

  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  timelineTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },

  timelineDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    columnGap: 2,
  },

  ratingText: {
    color: colors.warning,
    fontSize: 9,
    fontWeight: '900',
  },

  estimatePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  estimateText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '900',
  },
});

export default getStyles;
