import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
    ...getCommonStyles(colors),

    container: { flex: 1, backgroundColor: colors.background },
    headerContainer: { paddingHorizontal: 20, paddingTop: 35, backgroundColor: colors.surface, paddingBottom: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 25, fontWeight: 'bold', color: colors.textPrimary },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, position: 'relative' },
    searchIcon: { position: 'absolute', left: 15, zIndex: 1 },
    clearIcon: { position: 'absolute', right: 15, zIndex: 1 },
    searchInput: { flex: 1, backgroundColor: colors.surfaceMuted, borderRadius: 25, paddingLeft: 45, paddingRight: 45, height: 45, color: colors.textPrimary },
    filtersScroll: { flexDirection: 'row' },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 10 },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
    filterTextActive: { color: colors.white },
    listContainer: { flex: 1 },
    listContent: { padding: 20, paddingBottom: 100 },
    card: { backgroundColor: colors.surface, borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 2, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: colors.border },
    imageContainer: { height: 180, width: '100%', position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    discountBadge: { position: 'absolute', top: 15, left: 15, flexDirection: 'row', alignItems: 'center', columnGap: 4, backgroundColor: colors.deal, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
    discountText: { color: colors.white, fontSize: 11, fontWeight: '800' },
    heartButton: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.25)', padding: 8, borderRadius: 20 },
    priceBadge: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    priceText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
    cardBody: { padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, flex: 1, marginRight: 10 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceMuted, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
    ratingText: { fontSize: 12, fontWeight: 'bold', color: colors.warning, marginLeft: 4 },
    locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    locationInfo: { flexDirection: 'row', alignItems: 'center' },
    locationText: { fontSize: 13, color: colors.textSecondary, marginLeft: 4 },
    detailText: { fontSize: 13, fontWeight: '800', color: colors.primary },
    emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
    emptyStateText: { marginTop: 10, color: colors.textMuted, fontSize: 14, fontWeight: '500' }
});

export default getStyles;
