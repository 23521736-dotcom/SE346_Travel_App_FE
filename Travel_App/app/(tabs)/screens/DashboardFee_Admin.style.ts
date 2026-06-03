import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1, backgroundColor: '#f8fafc' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },

    summaryCard: { backgroundColor: '#f0f9ff', padding: 24, borderRadius: 24, marginBottom: 16 },
    mainTitle: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 24, lineHeight: 32 },
    amountBlock: { marginBottom: 20 },
    amountLabel: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 6 },
    amountValueBlue: { fontSize: 32, fontWeight: 'bold', color: '#0369a1' },
    amountValueBrown: { fontSize: 32, fontWeight: 'bold', color: '#92400e' },

    card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    editLink: { fontSize: 12, fontWeight: '600', color: '#0284c7' },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, marginBottom: 12 },
    settingRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
    settingIconMock: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingLabel: { fontSize: 13, fontWeight: '600', color: '#334155', flexShrink: 1 },
    settingValueBlue: { fontSize: 16, fontWeight: 'bold', color: '#0369a1' },
    settingValueDark: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },

    transactionHeader: { flexDirection: 'column', paddingHorizontal: 24, marginBottom: 16 },
    transactionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

    smallSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, height: 42, width: '100%' },
    smallSearchIcon: { fontSize: 14, marginRight: 8, color: '#64748b' },
    smallSearchInput: { flex: 1, fontSize: 13, color: '#0f172a' },

    tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 30, padding: 4, marginHorizontal: 24, marginBottom: 20 },
    tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 13, fontWeight: '500', color: '#64748b' },
    tabTextActive: { color: '#0369a1', fontWeight: 'bold' },

    tableHead: { flexDirection: 'row', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12, marginBottom: 8 },
    tableHeadText: { fontSize: 10, fontWeight: '700', color: '#64748b' },

    tableRow: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc', alignItems: 'center' },
    colName: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
    ownerNameText: { fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 },
    ownerAmountText: { fontSize: 12, fontWeight: '600', color: '#334155' },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%' },
    statusBadgePaid: { backgroundColor: '#dcfce7' },
    statusTextPaid: { color: '#16a34a', fontSize: 10, fontWeight: 'bold' },
    statusBadgeUnpaid: { backgroundColor: '#ffedd5' },
    statusTextUnpaid: { color: '#ea580c', fontSize: 10, fontWeight: 'bold' },

    emptyText: { textAlign: 'center', color: '#94a3b8', marginVertical: 20, fontStyle: 'italic' },
    viewAllBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    viewAllText: { fontSize: 13, fontWeight: 'bold', color: '#0369a1' },
});