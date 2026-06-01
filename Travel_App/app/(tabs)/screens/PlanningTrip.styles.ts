import { StyleSheet } from "react-native";
import { colors } from "../common/colors";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: { flex: 1, backgroundColor: '#F3F6FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 42, paddingBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a202c' },
  headerEditButton: {
    minWidth: 64,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: '#E3F8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },
  headerEditText: {
    color: '#0EB4D3',
    fontSize: 13,
    fontWeight: '900',
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 56 },

  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginRight: 12 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionPill: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
    backgroundColor: '#E3F8FF',
  },
  actionPillDanger: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
    backgroundColor: '#FEE2E2',
  },
  actionButtonDisabled: {
    opacity: 0.65,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  modifyBtnText: { color: '#0EB4D3', fontWeight: 'bold', fontSize: 13 },
  deleteTripText: { color: '#E53935', fontWeight: 'bold', fontSize: 13 },
  infoGrid: { flexDirection: 'row', columnGap: 14, marginBottom: 14 },
  infoCol: { flex: 1 },
  label: { fontSize: 12, color: '#a0aec0', marginBottom: 6, fontWeight: '600' },
  iconRow: { flexDirection: 'row', alignItems: 'center', columnGap: 7 },
  infoValue: { flex: 1, fontSize: 14, fontWeight: '700', color: '#2d3748' },
  dateRangeText: {
    color: '#94A3B8',
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
    borderColor: '#fff',
    backgroundColor: '#edf2f7',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#0EB4D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMoreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyMembersText: {
    fontSize: 12,
    color: '#a0aec0',
    marginLeft: 8,
    maxWidth: 120,
    fontStyle: 'italic',
  },
  avatarPlus: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#edf2f7', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  budgetAmount: { fontSize: 17, fontWeight: 'bold', color: '#0EB4D3', textAlign: 'right' },
  budgetUnit: { fontSize: 12, color: '#a0aec0', fontWeight: 'normal' },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Giữ nền trắng
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
    backgroundColor: '#0EB4D3',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EB4D3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  dayBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  dayTitleCol: { flex: 1, marginLeft: 14, marginRight: 10 },
  dayTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
  daySubtitle: { fontSize: 13, color: '#a0aec0', marginTop: 2 },

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
    color: '#333',
  },

  scheduleDayDate: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  dayContainer: {
    marginBottom: 24,
  },

  itineraryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF0F2',
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
    color: '#000',
  },

  itineraryRating: {
    fontSize: 12,
    color: '#888',
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
    color: '#888',
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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
    borderColor: '#1E88E5',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 4,
  },

  addLocationIcon: {
    marginRight: 8,
  },

  addLocationText: {
    color: '#1E88E5',
    fontWeight: 'bold',
    fontSize: 15,
  },

  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF0F2',
  },

  budgetIconContainer: {
    backgroundColor: '#1E88E5',
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
    color: '#333',
  },

  budgetCurrency: {
    fontSize: 13,
    color: '#888',
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
    backgroundColor: '#E3F8FF',
    padding: 14,
    paddingRight: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#B9ECF8',
    shadowColor: '#0EB4D3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  dayBadgeExpanded: {
    backgroundColor: '#0EB4D3',
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayBadgeCollapsed: {
    backgroundColor: '#0EB4D3',
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayBadgeTextExpanded: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },

  dayBadgeTextCollapsed: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  dayTitleExpanded: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2d3748',
  },

  dayTitleCollapsed: {
    fontSize: 16,
    fontWeight: '900',
    color: '#075B70',
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
    backgroundColor: '#D9E4EE',
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
    borderColor: '#0EB4D3',
    backgroundColor: '#fff',
    marginRight: 10,
  },

  timeTitle: {
    color: '#0EB4D3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  timeText: {
    color: '#A0AEC0',
    fontSize: 10,
    fontWeight: '700',
  },

  timelineCard: {
    marginLeft: 10,
    backgroundColor: '#fff',
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
    color: '#2D3748',
    fontSize: 15,
    fontWeight: '900',
  },

  timelineDescription: {
    color: '#718096',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    columnGap: 2,
  },

  ratingText: {
    color: '#F97316',
    fontSize: 9,
    fontWeight: '900',
  },

  estimatePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#CFFAF0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  estimateText: {
    color: '#0FAD90',
    fontSize: 10,
    fontWeight: '900',
  },
});

export default styles;
