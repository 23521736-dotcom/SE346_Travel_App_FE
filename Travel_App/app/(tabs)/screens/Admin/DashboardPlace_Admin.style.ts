import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    container: { flex: 1, backgroundColor: '#f8fafc', position: 'relative' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 38, paddingBottom: 14 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#18181b' },
    logoutButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca' },
    logoutText: { fontSize: 12, fontWeight: '700', color: '#dc2626' },

    contentArea: { flex: 1, paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#f8fafc' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 14, padding: 4, marginBottom: 16 },
    tabButton: { flex: 1, minHeight: 42, paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    tabButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
    tabText: { fontSize: 12, fontWeight: '700', color: '#52525b', textAlign: 'center' },
    tabTextActive: { color: '#0369a1', fontWeight: '800' },

    scrollContent: { paddingBottom: 100 },
    card: { padding: 14, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    imageContainer: { position: 'relative', marginBottom: 16 },
    cardImage: { width: '100%', height: 170, borderRadius: 12 },
    cardLabel: { position: 'absolute', top: 0, left: 0, paddingHorizontal: 12, paddingVertical: 5, borderTopLeftRadius: 12, borderBottomRightRadius: 12 },
    cardLabelText: { fontSize: 12, fontWeight: '600' },
    zoomIconContainer: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 },
    zoomIcon: { fontSize: 12, color: 'white' },

    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#09090b', marginBottom: 8 },
    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    userAvatarMock: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#d4d4d8', marginRight: 6 },
    userName: { fontSize: 14, color: '#52525b' },

    cardDesc: { fontSize: 14, color: '#3f3f46', lineHeight: 20 },
    readMoreBtn: { color: '#0284c7', fontSize: 14, fontWeight: '600', marginTop: 4 },

    actionRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 18, justifyContent: 'space-between', columnGap: 10, rowGap: 10 },
    actionBtn: { flexGrow: 1, flexBasis: '45%', minHeight: 44, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },

    btnApprove: { backgroundColor: '#15803d' },
    btnApproveText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
    btnReject: { backgroundColor: '#fecaca' },
    btnRejectText: { color: '#7f1d1d', fontSize: 14, fontWeight: '600' },
    btnDelete: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5' },
    btnDeleteText: { color: '#991b1b', fontSize: 14, fontWeight: 'bold' },

    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: 16, borderTopWidth: 1, borderColor: '#f4f4f5' },
    navItem: { alignItems: 'center', justifyContent: 'center', width: width / 4 },
    navIconMock: { fontSize: 20, marginBottom: 4 },
    navText: { fontSize: 10, fontWeight: '500', color: '#71717a' },
    navTextActive: { color: '#0369a1', fontWeight: 'bold' },
    navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0369a1', marginTop: 4 },

    emptyText: { textAlign: 'center', color: '#a1a1aa', marginTop: 40, fontStyle: 'italic' },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
    closeModalBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    closeModalText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
    fullScreenImage: { width: '100%', height: '80%' },
});
