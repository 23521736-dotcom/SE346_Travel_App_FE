import { Platform, StyleSheet } from 'react-native';

const colors = {
  primary: '#006591',
  primarySoft: '#c9e6ff',
  primaryBright: '#0ea5e9',
  background: '#f8f9ff',
  surface: '#ffffff',
  surfaceLow: '#eff4ff',
  surfaceHigh: '#ceddf5',
  text: '#0b1c30',
  textSecondary: '#3e4850',
  textMuted: '#6e7881',
  border: '#d3e4fe',
  borderMuted: '#bec8d2',
  success: '#00875A',
  warning: '#f59e0b',
  danger: '#dc2626',
};

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#006591',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  android: {
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(211,228,254,0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#006591',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLow,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 112,
  },
  card: {
    //backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    backgroundColor: '#FFFF',
    // borderWidth: 1,
    // borderColor: 'rgba(29, 8, 8, 0.9)',
    ...cardShadow,
  },
  statCard: {
    padding: 20,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 8,
    marginTop: 4,
  },
  statValue: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.text,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    marginBottom: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  mutedText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  stateCard: {
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 8,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.textMuted,
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  promoSelector: {
    flexDirection: 'row',
    marginTop: 12,
  },
  promoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surfaceLow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.surfaceLow,
  },
  promoChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  promoChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  promoChipTextActive: {
    color: colors.surface,
  },
  chartCard: {
    padding: 18,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 7,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  beforeDot: {
    backgroundColor: colors.borderMuted,
  },
  afterDot: {
    backgroundColor: colors.primaryBright,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chartArea: {
    height: 212,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    position: 'relative',
  },
  yAxis: {
    width: 36,
    paddingRight: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 28,
  },
  yAxisLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  chartGroups: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartGroup: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barsRow: {
    height: 172,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    columnGap: 6,
  },
  barSlot: {
    height: 172,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barValue: {
    marginBottom: 5,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.text,
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  beforeBar: {
    backgroundColor: colors.borderMuted,
  },
  afterBar: {
    backgroundColor: colors.primaryBright,
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryBright,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chartLabel: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  placeCard: {
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  swipeAction: {
    width: 112,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 6,
    backgroundColor: colors.danger,
  },
  swipeActionText: {
    paddingHorizontal: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.surface,
  },
  selectedPlaceCard: {
    // borderColor: 'rgba(0,101,145,0.1)',
    // borderWidth: 1,
    backgroundColor: colors.surfaceLow,
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryBright,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedPlaceAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,

    backgroundColor: '#006591',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  placeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  placeImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: colors.surfaceHigh,
  },
  selectedPlaceImage: {
    borderWidth: 2,
    borderColor: 'rgba(14,165,233,0.34)',
  },
  placeImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    flex: 1,
    minWidth: 0,
  },
  placeTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  selectedPlaceTitle: {
    color: colors.primary,
  },
  placeSubtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  selectedPlaceBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(0,101,145,0.14)',
  },
  metricRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(211,228,254,0.8)',
    paddingTop: 12,
    columnGap: 10,
  },
  selectedMetricRow: {
    borderTopColor: 'rgba(0,101,145,0.12)',
  },
  metricItem: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedMetricItem: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  badReviewMetricItem: {
  },
  metricLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricLabelComment: {
    color: colors.success,
  },
  metricLabelSave: {
    color: colors.warning,
  },
  metricLabelDanger: {
    color: colors.danger,
  },
  metricValue: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.text,
  },
  metricValuePrimary: {
    color: colors.primary,
  },
  metricValueComment: {
    color: colors.success,
  },
  metricValueSave: {
    color: colors.warning,
  },
  metricValueDanger: {
    color: colors.danger,
  },
});

export default styles;
