import { StyleSheet } from "react-native";
import { commonStyles } from "../common/styles";

export const styles = StyleSheet.create({
    ...commonStyles,
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 42,
        paddingBottom: 20,
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#003A70',
    },
    headerIconBg: {
        backgroundColor: '#E6EEF6',
        padding: 8,
        borderRadius: 20,
    },
    saveText: {
        color: '#006699',
        fontSize: 14,
        fontWeight: '800',
    },


    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',

    },
    noResultText: {
        textAlign: 'center',
        color: '#8E9EAB',
        marginTop: 20,
        fontSize: 16,
    },

    // Cards
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 16,
    },



    // Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#003A70',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#006699',
    },

    avatarLarge: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6EEF6',
    },
    avatarFallbackText: {
        color: '#006699',
        fontSize: 18,
        fontWeight: '800',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#003A70',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 13,
        color: '#707B81',
    },

    actionBtn: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#006699',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        minWidth: 92,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    actionBtnOutline: {
        backgroundColor: '#006699',
        borderWidth: 1,
        borderColor: '#006699',
    },
    actionBtnTextOutline: {
        color: 'white',
    },
    cancelBtn: {
        backgroundColor: '#F1F3F5',
        borderWidth: 0,
    },
    cancelBtnText: {
        color: '#707B81',
    },
    ownerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#E6EEF6',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 16,
    },
    ownerBadgeText: {
        color: '#006699',
        fontSize: 12,
        fontWeight: '700',
    },
    transferBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B9D8EA',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 16,
    },
    transferBtnText: {
        color: '#006699',
        fontSize: 12,
        fontWeight: '700',
    },

    recentRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
    },
    recentItem: {
        alignItems: 'center',
        width: '22%',
        marginBottom: 16,
    },
    avatarMedium: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 8,
        right: 0,
        width: 14,
        height: 14,
        backgroundColor: '#34D399',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#F8F9FB',
    },
    recentName: {
        fontSize: 13,
        color: '#4A5568',
        fontWeight: '500',
        marginBottom: 6,
        maxWidth: '100%',
    },
    recentAddIconBtn: {
        backgroundColor: '#006699',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentCancelIconBtn: {
        backgroundColor: '#E2E8F0',
    }
});
export default styles;
