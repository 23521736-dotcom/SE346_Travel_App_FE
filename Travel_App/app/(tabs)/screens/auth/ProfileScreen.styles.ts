import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.8,
        marginTop: 18,
        marginBottom: 12,
        marginLeft: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    icon: {
        width: 18,
        height: 18,
    },
    itemText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    chevron: {
        fontSize: 18,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.dangerSoft,
        paddingVertical: 15,
        borderRadius: 14,
        marginTop: 25,
    },
    logoutIcon: {
        width: 20,
        height: 20,
        tintColor: colors.danger,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.danger,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 18,
    },
    avatarContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.surface,
        padding: 4,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 66,
    },
    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
      
});

export default getStyles;
