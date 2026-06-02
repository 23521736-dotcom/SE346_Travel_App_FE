import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#09090b' },
    container: { flex: 1, backgroundColor: '#ffffff', position: 'relative' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 8 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#18181b' },

    contentArea: { flex: 1, paddingHorizontal: 24, paddingTop: 16, backgroundColor: '#ffffff' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#f4f4f5', borderRadius: 30, padding: 4, marginBottom: 24 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: '#e0f2fe' },
    tabText: { fontSize: 14, fontWeight: '500', color: '#52525b' },
    tabTextActive: { color: '#0c4a6e', fontWeight: '600' },

    scrollContent: { paddingBottom: 100 },
    card: { padding: 24, backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#f4f4f5', marginBottom: 24 },
    imageContainer: { position: 'relative', marginBottom: 16 },
    cardImage: { width: '100%', height: 180, borderRadius: 16 },
    cardLabel: { position: 'absolute', top: 0, left: 0, paddingHorizontal: 12, paddingVertical: 4, borderTopLeftRadius: 16, borderBottomRightRadius: 16 },
    cardLabelText: { fontSize: 12, fontWeight: '600' },
    zoomIconContainer: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 },
    zoomIcon: { fontSize: 12, color: 'white' },

    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#09090b', marginBottom: 8 },
    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    userAvatarMock: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#d4d4d8', marginRight: 6 },
    userName: { fontSize: 14, color: '#52525b' },

    cardDesc: { fontSize: 14, color: '#3f3f46', lineHeight: 20 },
    readMoreBtn: { color: '#0284c7', fontSize: 14, fontWeight: '600', marginTop: 4 },

    actionRow: { flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, flexDirection: 'row', justifyContent: 'center' },

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
