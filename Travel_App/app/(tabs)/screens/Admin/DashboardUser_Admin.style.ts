import { StyleSheet, Dimensions } from 'react-native';
import { ThemeType } from '../../common/theme';

const { width } = Dimensions.get('window');

const getStyles = (colors: ThemeType) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background, position: 'relative' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    logoMock: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, marginRight: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
    logoutButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: colors.danger },
    logoutText: { fontSize: 12, fontWeight: '700', color: colors.danger },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

    statsContainer: { marginBottom: 16 },
    statCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    statTitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 16, height: 50, borderRadius: 25, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    searchIcon: { fontSize: 16, marginRight: 8, color: colors.textMuted },
    searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },

    tabContainer: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: 30, padding: 4, marginBottom: 16 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 30 },
    tabButtonActive: { backgroundColor: colors.surface, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
    tabTextActive: { color: colors.primary, fontWeight: 'bold' },

    tableCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
    tableHeaderText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16, marginBottom: 16, alignItems: 'center' },

    userInfoCol: { flex: 1.5, flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8, backgroundColor: colors.surfaceMuted },
    avatarBanned: { opacity: 0.5, tintColor: 'gray' },
    userNameBlock: { flex: 1 },
    userName: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
    textBanned: { color: colors.textMuted, textDecorationLine: 'line-through' },
    userJoined: { fontSize: 10, color: colors.textSecondary },

    userEmailCol: { flex: 1.4, justifyContent: 'center', paddingRight: 4 },
    userEmail: { fontSize: 11, color: colors.textSecondary },

    userActionCol: { flex: 0.6, justifyContent: 'center', alignItems: 'center' },
    statusBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
    btnBan: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
    btnBanText: { fontSize: 10, fontWeight: 'bold', color: colors.danger },
    btnUnban: { backgroundColor: colors.successSoft, borderColor: colors.success },
    btnUnbanText: { fontSize: 10, fontWeight: 'bold', color: colors.success },

    emptyText: { textAlign: 'center', color: colors.textMuted, marginVertical: 20, fontStyle: 'italic' },

    paginationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
    paginationText: { fontSize: 10, color: colors.textSecondary, flex: 1 },
    paginationControls: { flexDirection: 'row', alignItems: 'center' },
    pageArrow: { color: colors.primary, fontSize: 16, paddingHorizontal: 8, fontWeight: 'bold' },
    pageArrowDisabled: { color: colors.textMuted },
    pageNumberBtn: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginHorizontal: 2 },
    pageNumberActive: { backgroundColor: colors.primary },
    pageNumberText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
    pageNumberTextActive: { color: colors.white },

    fabBtn: { position: 'absolute', right: 20, bottom: 90, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 6, zIndex: 10 },
    fabIcon: { fontSize: 20, color: colors.white },

    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.surface, paddingVertical: 16, borderTopWidth: 1, borderColor: colors.border },
    navItem: { alignItems: 'center', justifyContent: 'center', width: width / 4 },
    navIconMock: { fontSize: 20, marginBottom: 4 },
    navText: { fontSize: 10, fontWeight: '500', color: colors.textMuted },
    navTextActive: { color: colors.primary, fontWeight: 'bold' },
    navDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 4 },
});

export default getStyles;
