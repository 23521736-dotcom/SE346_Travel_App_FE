import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),
  
  // Nút tròn đè lên ảnh
  roundButton: {
    position: 'absolute',
    top: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Thẻ thông tin ngang (Rating, Price, Feature)
  detailCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    margin: 10,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 15,
  },

  iconBadge: {
    borderRadius: 12,
    margin: 12,
    padding: 8,
  },

  badgeLabel: {
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
  },

  badgeValue: {
    fontWeight: '700', 
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Review Section
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    rowGap: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderLight,
  },

  promotionsSection: {
    marginTop: 18,
    rowGap: 10,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: '700',
  },

  promotionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 12,
  },

  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  promotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    marginRight: 12,
  },

  promotionContent: {
    flex: 1,
    rowGap: 8,
  },

  promotionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },

  promotionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  promotionBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  promotionInfoList: {
    marginTop: 12,
    rowGap: 8,
  },

  promotionInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 8,
  },

  promotionInfoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },

  promotionSchedule: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
});

export default getStyles;
