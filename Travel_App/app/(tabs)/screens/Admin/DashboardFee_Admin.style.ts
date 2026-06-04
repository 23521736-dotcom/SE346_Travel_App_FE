import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1, backgroundColor: '#f8fafc' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 38, paddingBottom: 14 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
    logoutButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca' },
    logoutText: { fontSize: 12, fontWeight: '700', color: '#dc2626' },

    scrollContent: { paddingHorizontal: 16, paddingBottom: 28 },

    summaryCard: { backgroundColor: '#f0f9ff', padding: 18, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#bae6fd' },
    mainTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 18, lineHeight: 28 },
    amountBlock: { marginBottom: 20 },
    amountLabel: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 6 },
    amountValueBlue: { fontSize: 28, fontWeight: 'bold', color: '#0369a1' },
    amountValueBrown: { fontSize: 28, fontWeight: 'bold', color: '#92400e' },

    card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    editLink: { fontSize: 12, fontWeight: '600', color: '#0284c7' },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, marginBottom: 10 },
    settingRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
    settingIconMock: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingLabel: { fontSize: 13, fontWeight: '600', color: '#334155', flexShrink: 1 },
    settingValueBlue: { fontSize: 16, fontWeight: 'bold', color: '#0369a1' },
    settingValueDark: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },

    transactionHeader: { flexDirection: 'column', paddingHorizontal: 16, marginBottom: 16 },
    transactionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

    smallSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, height: 42, width: '100%' },
    smallSearchIcon: { fontSize: 14, marginRight: 8, color: '#64748b' },
    smallSearchInput: { flex: 1, fontSize: 13, color: '#0f172a' },

    tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 14, padding: 4, marginHorizontal: 16, marginBottom: 16 },
    tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 13, fontWeight: '500', color: '#64748b' },
    tabTextActive: { color: '#0369a1', fontWeight: 'bold' },

    tableHead: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12, marginBottom: 8 },
    tableHeadText: { fontSize: 10, fontWeight: '700', color: '#64748b' },

    tableRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f8fafc', alignItems: 'center', columnGap: 8 },
    colName: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
    ownerNameText: { fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 },
    ownerAmountText: { fontSize: 12, fontWeight: '600', color: '#334155' },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minWidth: 72 },
    statusBadgePaid: { backgroundColor: '#dcfce7' },
    statusTextPaid: { color: '#16a34a', fontSize: 10, fontWeight: 'bold' },
    statusBadgeUnpaid: { backgroundColor: '#ffedd5' },
    statusTextUnpaid: { color: '#ea580c', fontSize: 10, fontWeight: 'bold' },

    emptyText: { textAlign: 'center', color: '#94a3b8', marginVertical: 20, fontStyle: 'italic' },
    viewAllBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    viewAllText: { fontSize: 13, fontWeight: 'bold', color: '#0369a1' },
});
