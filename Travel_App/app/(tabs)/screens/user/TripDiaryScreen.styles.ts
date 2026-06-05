import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    flex: 1,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  primaryIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 42,
    rowGap: 28,
  },

  heroCard: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },

  heroTextWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    marginTop: 2,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
    marginBottom: 18,
  },

  addEntryButton: {
    minHeight: 38,
    borderRadius: 19,
    paddingHorizontal: 13,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
  },

  addEntryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  timelineWrap: {
    paddingLeft: 32,
    rowGap: 16,
  },

  timelineLine: {
    position: "absolute",
    left: 11,
    top: 8,
    bottom: 0,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },

  timelineLineActive: {
    position: "absolute",
    left: 11,
    top: 8,
    width: 2,
    height: 112,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },

  timelineCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  timelineCardDeleting: {
    opacity: 0.58,
  },

  timelineDot: {
    position: "absolute",
    left: -25,
    top: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },

  timelineDotMuted: {
    borderColor: colors.borderLight,
    backgroundColor: colors.textMuted,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 12,
    marginBottom: 12,
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  iconButtonDanger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
  },

  placeName: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
  },

  placeNameMuted: {
    color: colors.textPrimary,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    marginTop: 4,
  },

  timeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },

  galleryThree: {
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 14,
  },

  galleryTwo: {
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 14,
  },

  galleryImageSmall: {
    flex: 1,
    height: 96,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },

  galleryImageLarge: {
    flex: 1,
    height: 128,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },

  moreImageWrap: {
    flex: 1,
    height: 96,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },

  moreImage: {
    width: "100%",
    height: "100%",
  },

  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  moreText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  quoteBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLight,
    backgroundColor: colors.surfaceMuted,
  },

  quoteBoxMuted: {
    borderLeftColor: colors.borderLight,
  },

  quoteText: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },

  stateBox: {
    minHeight: 120,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  stateText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },

  errorBox: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.dangerSoft,
  },

  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800",
  },

  emptyBox: {
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },

  emptyButton: {
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginTop: 16,
  },

  emptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  ctaWrap: {
    paddingTop: 4,
    paddingBottom: 10,
    rowGap: 14,
  },

  ctaButton: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },

  ctaText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },

  helperText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});

export default getStyles;
