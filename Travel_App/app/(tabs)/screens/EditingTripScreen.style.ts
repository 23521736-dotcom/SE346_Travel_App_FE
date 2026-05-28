import { StyleSheet } from "react-native";
import { commonStyles } from "../common/styles";

const styles = StyleSheet.create({
    ...commonStyles,

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginVertical: 25,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    heroCard: {
        width: '100%',
        height: 140,
        marginBottom: 24,
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: 16,
        height: '100%',
        justifyContent: 'flex-end',
    },
    heroSubtitle: {
        color: '#E0E0E0',
        fontSize: 12,
        marginBottom: 4,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
        marginTop: 12,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F7FB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    datePickerRow: {
        flexDirection: 'row',
        gap: 10,
    },
    datePickerButton: {
        flex: 1,
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F7FB',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    datePickerLabel: {
        fontSize: 11,
        color: '#888',
        fontWeight: '700',
        marginBottom: 3,
    },
    durationHint: {
        color: '#1E88E5',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E88E5',
        marginBottom: 12,
    },
    itineraryCard: {
        flexDirection: 'row',
        backgroundColor: '#F4F7FB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    itineraryImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itineraryInfo: {
        flex: 1,
    },
    itineraryTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    itineraryRating: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
        marginTop: 2,
    },
    itineraryDetailsRow: {
        flexDirection: 'row',
    },
    detailLabel: {
        fontSize: 10,
        color: '#888',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    deleteBtn: {
        padding: 8,
    },
    addLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#1E88E5',
        borderStyle: 'dashed',
        borderRadius: 12,
        marginTop: 4,
    },
    addLocationText: {
        color: '#1E88E5',
        fontWeight: 'bold',
        fontSize: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addText: {
        color: '#1E88E5',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: {
        color: '#1E88E5',
        marginRight: 6,
        fontSize: 14,
    },
    addTagBtn: {
        backgroundColor: '#F4F7FB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
    },
    addTagText: {
        color: '#888',
        fontSize: 14,
    },
    budgetCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F7FB',
        borderRadius: 16,
        padding: 16,
    },
    budgetIconContainer: {
        backgroundColor: '#1E88E5',
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    budgetInfo: {
        flex: 1,
    },
    budgetAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    budgetCurrency: {
        fontSize: 13,
        color: '#888',
    },
    badge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#1E88E5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    avatarOverlap: {
        marginLeft: -15,
    },
    avatarExtra: {
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarExtraText: {
        color: '#1E88E5',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addMemberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addMemberIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1E88E5',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    addMemberTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    addMemberSub: {
        fontSize: 12,
        color: '#888',
    },
    dayContainer: {
        marginBottom: 24,
    },
    dayHeader: {
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    extraCountContainer: {
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    extraCountText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default styles;
