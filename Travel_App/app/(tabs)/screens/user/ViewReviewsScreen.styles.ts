import { StyleSheet } from "react-native";
import { colors } from "../../common/colors";
import { commonStyles } from "../../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  avatarBorder: {
    borderWidth: 3,
    borderColor: colors.primary,
    width: 150,
    height: 150,
    borderRadius: 70,
    overflow: "hidden",
    position: 'relative',
  },

  reviewCard: {
    backgroundColor: colors.white,
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 10,
  },

  reviewAuthorRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },

  reviewAuthorInfo: {
    flex: 1,
    minWidth: 0,
  },

  reviewUserName: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },

  reviewDate: {
    flexShrink: 0,
    maxWidth: 94,
    color: '#908a8a',
    fontSize: 12,
    textAlign: 'right',
  },

  reviewContent: {
    color: '#4a4a4a',
    fontSize: 15,
    lineHeight: 22,
  },

  reviewActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 10,
    marginTop: 8,
    alignItems: 'center',
  },

  bottomActionContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 35,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  writeReviewButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  writeReviewButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },

  editModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
  },

  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  editModalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },

  editCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },

  editStarRow: {
    flexDirection: 'row',
    columnGap: 8,
    marginBottom: 14,
  },

  editTextArea: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },

  editActions: {
    flexDirection: 'row',
    columnGap: 12,
    marginTop: 16,
  },

  editActionButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelEditButton: {
    backgroundColor: colors.surface,
  },

  cancelEditButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },

  saveEditButton: {
    backgroundColor: colors.primary,
  },

  disabledEditButton: {
    opacity: 0.7,
  },

  saveEditButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default styles;
