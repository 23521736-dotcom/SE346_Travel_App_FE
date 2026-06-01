import { Platform, StyleSheet } from "react-native";
import { colors } from "../common/colors";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,
  
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
    borderColor: '#D8EEF7',
    borderRadius: 25,
    paddingLeft: 45,
    paddingRight: 45,
    height: 45,
    color: '#333',
    shadowColor: '#000',
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
    color: 'black',
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
    color: colors.black,
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
    borderColor: colors.borderLight,
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
    backgroundColor: colors.surface, 
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
    backgroundColor: '#0F6C82',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  bottomSheetContainer: {
    width: '100%',
  },

  bottomSheet: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
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
    color: '#2D3748',
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
    color: '#718096',
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  icon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
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
    color: '#718096',
    fontWeight: '600',
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: '#0EB4D3',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#0EB4D3',
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

export default styles;
