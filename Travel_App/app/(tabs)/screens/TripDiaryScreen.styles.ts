import { StyleSheet } from "react-native";
import { colors } from "../common/colors";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  screen: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: "rgba(248,249,255,0.94)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(190,200,210,0.22)",
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
    backgroundColor: "rgba(229,238,255,0.76)",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
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
    backgroundColor: "#0EA5E9",
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
    color: "#0B1C30",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 18,
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
    backgroundColor: "#CBD5E1",
  },

  timelineLineActive: {
    position: "absolute",
    left: 11,
    top: 8,
    width: 2,
    height: 112,
    borderRadius: 1,
    backgroundColor: "#0EA5E9",
  },

  timelineCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(190,200,210,0.18)",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  timelineDot: {
    position: "absolute",
    left: -25,
    top: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: "rgba(14,165,233,0.22)",
    backgroundColor: "#0EA5E9",
  },

  timelineDotMuted: {
    borderColor: "rgba(190,200,210,0.24)",
    backgroundColor: "#BEC8D2",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 12,
    marginBottom: 12,
  },

  placeName: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
  },

  placeNameMuted: {
    color: "#0B1C30",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    marginTop: 4,
  },

  timeText: {
    color: "#3E4850",
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
    borderLeftColor: "rgba(14,165,233,0.42)",
    backgroundColor: "rgba(229,238,255,0.52)",
  },

  quoteBoxMuted: {
    borderLeftColor: "rgba(110,120,129,0.24)",
  },

  quoteText: {
    color: "#3E4850",
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },

  ctaWrap: {
    paddingTop: 4,
    paddingBottom: 10,
    rowGap: 14,
  },

  ctaButton: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: "#0EA5E9",
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
    color: "#6E7881",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});

export default styles;
