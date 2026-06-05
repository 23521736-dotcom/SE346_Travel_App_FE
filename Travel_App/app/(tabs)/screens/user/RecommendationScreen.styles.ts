import { StyleSheet, Dimensions } from 'react-native';
import { ThemeType } from '../../common/theme';

const CARD_WIDTH = Dimensions.get('window').width * 0.7;

const getStyles = (colors: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  placeCard: {
    width: CARD_WIDTH,
    marginLeft: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  placeImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.surfaceMuted,
  },
  matchBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  placeInfo: {
    padding: 10,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  placeRegion: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  placeExplanation: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 3,
  },
  ratingTextValue: {
    color: colors.warning,
  },
  ratingCount: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 3,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default getStyles;