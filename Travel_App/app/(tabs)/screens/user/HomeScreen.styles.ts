import { Platform, StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import type { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),
  
  // Search bar override
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 15,
  },

  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },

  clearIcon: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },

  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 25,
    paddingLeft: 45,
    paddingRight: 45,
    height: 45,
    color: colors.textPrimary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  filtersScroll: {
    flexDirection: 'row',
    marginTop: 12,
  },

  filtersContent: {
    marginHorizontal: 5,
    marginBottom: 5,
  },

  containerCategoryButton: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center'
  },

  categoryButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },

  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  placeActionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  // List Container
  listWrapper: {
    marginTop: 10,
    backgroundColor: colors.surfaceMuted,
    flex: 1,
    borderRadius: 15,
  },

  // Place Card Style
  card: {
    backgroundColor: colors.surface,
    flexDirection: 'column',
    margin: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.border,
    padding: 12,
  },

  contentContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5 
  },

  ratingBadge: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    columnGap: 4,
  },

  TagContainer:  {
    height: 1, 
    backgroundColor: colors.border,
    width: '100%', 
    marginVertical: 10 
  },

  dealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    backgroundColor: colors.deal,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },

  dealBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },

  bottomSheetContainer: {
    width: '100%',
  },

  bottomSheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  closeButton: {
    padding: 4,
  },

  formContainer: {
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },

  icon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    height: '100%',
  },

  actionContainer: {
    marginTop: 10,
  },

  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default getStyles;
