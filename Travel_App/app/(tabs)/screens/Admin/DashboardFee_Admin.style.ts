import { StyleSheet, Dimensions } from 'react-native';
import { ThemeType } from '../../common/theme';

const { width } = Dimensions.get('window');

const getStyles = (colors: ThemeType) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
    logoutButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: colors.danger },
    logoutText: { fontSize: 12, fontWeight: '700', color: colors.danger },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

    summaryCard: { backgroundColor: colors.primaryLight, padding: 24, borderRadius: 24, marginBottom: 16 },
    mainTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 24, lineHeight: 32 },
    amountBlock: { marginBottom: 20 },
    amountLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', marginBottom: 6 },
    amountValueBlue: { fontSize: 32, fontWeight: 'bold', color: colors.primary },
    amountValueBrown: { fontSize: 32, fontWeight: 'bold', color: colors.warning },

    card: { backgroundColor: colors.surface, padding: 24, borderRadius: 24, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
    editLink: { fontSize: 12, fontWeight: '600', color: colors.primary },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surfaceMuted, padding: 16, borderRadius: 16, marginBottom: 12 },
    settingRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
    settingIconMock: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, flexShrink: 1 },
    settingValueBlue: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    settingValueDark: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },

    transactionHeader: { flexDirection: 'column', paddingHorizontal: 24, marginBottom: 16 },
    transactionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

    smallSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 12, paddingHorizontal: 12, height: 42, width: '100%' },
    smallSearchIcon: { fontSize: 14, marginRight: 8, color: colors.textMuted },
    smallSearchInput: { flex: 1, fontSize: 13, color: colors.textPrimary },

    tabContainer: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: 30, padding: 4, marginHorizontal: 0, marginBottom: 20 },
    tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: colors.surface, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
    tabTextActive: { color: colors.primary, fontWeight: 'bold' },

    tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 8 },
    tableHeadText: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

    tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center' },
    colName: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
    ownerNameText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, flex: 1 },
    ownerAmountText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%' },
    statusBadgePaid: { backgroundColor: colors.successSoft },
    statusTextPaid: { color: colors.success, fontSize: 10, fontWeight: 'bold' },
    statusBadgeUnpaid: { backgroundColor: colors.warningSoft },
    statusTextUnpaid: { color: colors.warning, fontSize: 10, fontWeight: 'bold' },

    emptyText: { textAlign: 'center', color: colors.textMuted, marginVertical: 20, fontStyle: 'italic' },
    viewAllBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border },
    viewAllText: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
});

export default getStyles;
