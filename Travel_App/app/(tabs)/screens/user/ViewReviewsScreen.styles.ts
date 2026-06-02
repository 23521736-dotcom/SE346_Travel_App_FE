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
