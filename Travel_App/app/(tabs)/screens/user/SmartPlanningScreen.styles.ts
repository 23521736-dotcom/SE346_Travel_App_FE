import { StyleSheet } from "react-native";
import { colors } from "../../common/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  scrollContent: {
    padding: 16,
  },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.textPrimary,
  },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  preferenceWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  weightInput: {
    width: 60,
    textAlign: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.textPrimary,
  },

  placeItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },

  placeItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  placeImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },

  placeInfo: {
    flex: 1,
  },

  placeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  placeCategory: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  placeRating: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 2,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  summaryCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },

  summaryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  dayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },

  dayStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  dayStatText: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 4,
  },

  activityTime: {
    width: 55,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },

  activityContent: {
    flex: 1,
    marginLeft: 8,
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  activityMeta: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 8,
  },

  activityMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  travelInfo: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },

  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },

  applyButton: {
    backgroundColor: colors.success,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },

  stepDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },

  stepDotCompleted: {
    backgroundColor: colors.primary,
  },
});

export default styles;
