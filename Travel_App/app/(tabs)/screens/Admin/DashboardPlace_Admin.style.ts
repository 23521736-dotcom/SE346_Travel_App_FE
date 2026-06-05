import { StyleSheet, Dimensions } from 'react-native';
import { ThemeType } from '../../common/theme';

const { width } = Dimensions.get('window');

const getStyles = (colors: ThemeType) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background, position: 'relative' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 8 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
    logoutButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: colors.danger },
    logoutText: { fontSize: 12, fontWeight: '700', color: colors.danger },

    contentArea: { flex: 1, paddingHorizontal: 24, paddingTop: 16, backgroundColor: colors.background },
    tabContainer: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: 30, padding: 4, marginBottom: 24 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: colors.primaryLight },
    tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
    tabTextActive: { color: colors.primary, fontWeight: '600' },

    scrollContent: { paddingBottom: 100 },
    card: { padding: 24, backgroundColor: colors.surface, borderRadius: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
    imageContainer: { position: 'relative', marginBottom: 16 },
    cardImage: { width: '100%', height: 180, borderRadius: 16, backgroundColor: colors.surfaceMuted },
    cardLabel: { position: 'absolute', top: 0, left: 0, paddingHorizontal: 12, paddingVertical: 4, borderTopLeftRadius: 16, borderBottomRightRadius: 16 },
    cardLabelText: { fontSize: 12, fontWeight: '600' },
    zoomIconContainer: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 },
    zoomIcon: { fontSize: 12, color: 'white' },

    cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    userAvatarMock: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surfaceMuted, marginRight: 6 },
    userName: { fontSize: 14, color: colors.textSecondary },

    cardDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    readMoreBtn: { color: colors.primary, fontSize: 14, fontWeight: '600', marginTop: 4 },

    actionRow: { flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' },
    actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, flexDirection: 'row', justifyContent: 'center' },

    btnApprove: { backgroundColor: colors.success },
    btnApproveText: { color: colors.white, fontSize: 14, fontWeight: '600' },
    btnReject: { backgroundColor: colors.warningSoft },
    btnRejectText: { color: colors.warning, fontSize: 14, fontWeight: '600' },
    btnDelete: { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: colors.danger },
    btnDeleteText: { color: colors.danger, fontSize: 14, fontWeight: 'bold' },

    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.surface, paddingVertical: 16, borderTopWidth: 1, borderColor: colors.border },
    navItem: { alignItems: 'center', justifyContent: 'center', width: width / 4 },
    navIconMock: { fontSize: 20, marginBottom: 4 },
    navText: { fontSize: 10, fontWeight: '500', color: colors.textMuted },
    navTextActive: { color: colors.primary, fontWeight: 'bold' },
    navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 4 },

    emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontStyle: 'italic' },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
    closeModalBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    closeModalText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    fullScreenImage: { width: '100%', height: '80%' },
});

export default getStyles;
