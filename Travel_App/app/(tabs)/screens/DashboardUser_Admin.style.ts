import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1, backgroundColor: '#f8fafc', position: 'relative' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    logoMock: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0284c7', marginRight: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

    statsContainer: { marginBottom: 16 },
    statCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    statTitle: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
    statValue: { fontSize: 20, fontWeight: 'bold' },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 16, height: 50, borderRadius: 25, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

    tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 30, padding: 4, marginBottom: 16 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 14, fontWeight: '500', color: '#64748b' },
    tabTextActive: { color: '#0369a1', fontWeight: 'bold' },

    tableCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12, marginBottom: 12 },
    tableHeaderText: { fontSize: 12, fontWeight: '600', color: '#475569' },

    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16, marginBottom: 16, alignItems: 'center' },

    // Cột 1: User Profile
    userInfoCol: { flex: 1.5, flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8, backgroundColor: '#e2e8f0' },
    avatarBanned: { opacity: 0.5, tintColor: 'gray' },
    userNameBlock: { flex: 1 },
    userName: { fontSize: 12, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
    textBanned: { color: '#94a3b8', textDecorationLine: 'line-through' },
    userJoined: { fontSize: 10, color: '#64748b' },

    // Cột 2: Email
    userEmailCol: { flex: 1.4, justifyContent: 'center', paddingRight: 4 },
    userEmail: { fontSize: 11, color: '#475569' },

    // Cột 3: Action Button
    userActionCol: { flex: 0.6, justifyContent: 'center', alignItems: 'center' },
    statusBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
    btnBan: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
    btnBanText: { fontSize: 10, fontWeight: 'bold', color: '#dc2626' },
    btnUnban: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
    btnUnbanText: { fontSize: 10, fontWeight: 'bold', color: '#16a34a' },

    emptyText: { textAlign: 'center', color: '#94a3b8', marginVertical: 20, fontStyle: 'italic' },

    // Styles Phân Trang
    paginationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
    paginationText: { fontSize: 10, color: '#64748b', flex: 1 },
    paginationControls: { flexDirection: 'row', alignItems: 'center' },
    pageArrow: { color: '#0369a1', fontSize: 16, paddingHorizontal: 8, fontWeight: 'bold' },
    pageArrowDisabled: { color: '#cbd5e1' },
    pageNumberBtn: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginHorizontal: 2 },
    pageNumberActive: { backgroundColor: '#0284c7' },
    pageNumberText: { fontSize: 12, fontWeight: '600', color: '#334155' },
    pageNumberTextActive: { color: '#ffffff' },

    fabBtn: { position: 'absolute', right: 20, bottom: 90, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 6, zIndex: 10 },
    fabIcon: { fontSize: 20, color: '#ffffff' },

    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#ffffff', paddingVertical: 16, borderTopWidth: 1, borderColor: '#f1f5f9' },
    navItem: { alignItems: 'center', justifyContent: 'center', width: width / 4 },
    navIconMock: { fontSize: 20, marginBottom: 4 },
    navText: { fontSize: 10, fontWeight: '500', color: '#94a3b8' },
    navTextActive: { color: '#0ea5e9', fontWeight: 'bold' },
    navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0ea5e9', marginTop: 4 },
});