import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getApiErrorMessage } from '../../../lib/api/client';
import { mapApiTripToDraft, upsertTripToBackend } from '../../../lib/api/trips';
import { Collaborator, normalizeTripDays, TripData, upsertTripDraft } from '../store/tripDraftStore';
import screenStyles from './AddCollaboratorsScreen.style';

// --- MOCK DATA TỔNG HỢP ---
const allUsers = [
    { id: '1', name: 'Alex Rivera', email: 'alex.travels@cloud.com', type: 'add', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isRecent: false },
    { id: '2', name: 'Sarah Chen', email: 's.chen@expedition.io', type: 'add', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isRecent: false },
    { id: '3', name: 'Jordan', email: 'jordan@mail.com', type: 'add', online: true, avatar: 'https://randomuser.me/api/portraits/men/22.jpg', isRecent: true },
    { id: '4', name: 'Elena', email: 'elena@mail.com', type: 'add', online: true, avatar: 'https://randomuser.me/api/portraits/women/31.jpg', isRecent: true },
    { id: '5', name: 'Marcus', email: 'marcus@mail.com', type: 'add', online: false, avatar: 'https://randomuser.me/api/portraits/men/46.jpg', isRecent: true },
    { id: '6', name: 'Sofia', email: 'sofia@mail.com', type: 'add', online: false, avatar: 'https://randomuser.me/api/portraits/women/68.jpg', isRecent: true },
];

export default function AddCollaboratorsScreen({ navigation, route }: any) {
    const trip = route?.params?.tripData as TripData | undefined;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // State lưu trữ danh sách ID các user đã được bấm Add/Invite
    const [pendingUsers, setPendingUsers] = useState<Record<string, boolean>>(
        () =>
            trip?.members.reduce<Record<string, boolean>>((selected, member) => {
                selected[member.id] = true;
                return selected;
            }, {}) || {}
    );

    // Hàm chuyển đổi trạng thái Add <-> Cancel
    const toggleUserAction = (userId: any) => {
        setPendingUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const saveCollaborators = async () => {
        if (isSaving) {
            return;
        }

        if (!trip) {
            navigation.goBack();
            return;
        }

        const selectedMockUsers: Collaborator[] = allUsers
            .filter((user) => pendingUsers[user.id])
            .map((user) => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
            }));
        const selectedMockUserIds = new Set(selectedMockUsers.map((member) => member.id));
        const existingSelectedMembers = (trip.members || []).filter(
            (member) => pendingUsers[member.id] && !selectedMockUserIds.has(member.id)
        );
        const members: Collaborator[] = [...existingSelectedMembers, ...selectedMockUsers];
        const updatedTrip = {
            ...trip,
            members,
        };

        setIsSaving(true);
        try {
            const savedTrip = await upsertTripToBackend(
                updatedTrip as Record<string, unknown>,
                updatedTrip.id
            );

            const persistedTrip = normalizeTripDays({
                ...updatedTrip,
                ...mapApiTripToDraft(savedTrip),
            } as TripData);

            if (persistedTrip.id) {
                upsertTripDraft(persistedTrip);
            }

            navigation.navigate({
                name: 'EditingTrip',
                params: { tripData: persistedTrip },
                merge: true,
            });
        } catch (error) {
            Alert.alert('Loi luu collaborators', getApiErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    // Lọc dữ liệu dựa trên trạng thái
    const suggestedUsers = allUsers.filter(u => !u.isRecent);
    const recentCollaborators = allUsers.filter(u => u.isRecent);

    // Lọc dữ liệu tìm kiếm
    const searchResults = allUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Component render nút Add/Cancel chung cho danh sách dọc
    const renderActionButton = (user: any) => {
        const isPending = pendingUsers[user.id];

        return (
            <TouchableOpacity
                style={[
                    screenStyles.actionBtn,
                    user.type === 'add' && !isPending ? screenStyles.actionBtnOutline : null,
                    isPending ? screenStyles.cancelBtn : null
                ]}
                onPress={() => toggleUserAction(user.id)}
            >
                <Text style={[
                    screenStyles.actionBtnText,
                    user.type === 'add' && !isPending ? screenStyles.actionBtnTextOutline : null,
                    isPending ? screenStyles.cancelBtnText : null
                ]}>
                    {isPending ? 'Cancel' : 'Add'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={screenStyles.container}>
            <View style={screenStyles.scrollContent}>

                {/* HEADER */}
                <View style={screenStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#003A70" />
                    </TouchableOpacity>
                    <Text style={screenStyles.headerTitle}>Add Collaborators</Text>
                    <TouchableOpacity onPress={saveCollaborators} disabled={isSaving}>
                        <Text style={[screenStyles.saveText, isSaving && { opacity: 0.6 }]}> 
                            {isSaving ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SEARCH BAR */}
                <View style={screenStyles.searchContainer}>
                    <Feather name="search" size={20} color="#8E9EAB" />
                    <TextInput
                        style={[screenStyles.searchInput, { outline: 'none' } as any]}
                        placeholder="Search by name or email..."
                        placeholderTextColor="#8E9EAB"
                        value={searchQuery}
                        onChangeText={setSearchQuery}

                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x-circle" size={18} color="#8E9EAB" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* NẾU ĐANG CÓ TỪ KHÓA TÌM KIẾM -> HIỂN THỊ KẾT QUẢ TÌM KIẾM */}
                    {searchQuery.length > 0 ? (
                        <View>
                            <Text style={screenStyles.sectionTitle}>Search Results</Text>
                            <View style={{ marginTop: 16 }}>
                                {searchResults.length > 0 ? searchResults.map(user => (
                                    <View key={user.id} style={screenStyles.card}>
                                        <Image source={{ uri: user.avatar }} style={screenStyles.avatarLarge} />
                                        <View style={screenStyles.cardTextContainer}>
                                            <Text style={screenStyles.userName}>{user.name}</Text>
                                            <Text style={screenStyles.userEmail}>{user.email}</Text>
                                        </View>
                                        {renderActionButton(user)}
                                    </View>
                                )) : (
                                    <Text style={screenStyles.noResultText}>No users found.</Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View>
                            {/* SUGGESTED SECTION */}
                            <View style={screenStyles.sectionHeader}>
                                <Text style={screenStyles.sectionTitle}>Suggested</Text>
                            </View>
                            {suggestedUsers.map((user) => (
                                <View key={user.id} style={screenStyles.card}>
                                    <Image source={{ uri: user.avatar }} style={screenStyles.avatarLarge} />
                                    <View style={screenStyles.cardTextContainer}>
                                        <Text style={screenStyles.userName}>{user.name}</Text>
                                        <Text style={screenStyles.userEmail}>{user.email}</Text>
                                    </View>
                                    {renderActionButton(user)}
                                </View>
                            ))}

                            {/* RECENT COLLABORATORS */}
                            <View style={[screenStyles.sectionHeader, { marginTop: 24 }]}>
                                <Text style={screenStyles.sectionTitle}>Recent Collaborators</Text>
                            </View>

                            <View style={screenStyles.recentRow}>
                                {recentCollaborators.map((user) => {
                                    const isPending = pendingUsers[user.id];
                                    return (
                                        <View key={user.id} style={screenStyles.recentItem}>
                                            <View>
                                                <Image source={{ uri: user.avatar }} style={screenStyles.avatarMedium} />
                                                {user.online && <View style={screenStyles.onlineIndicator} />}
                                            </View>
                                            <Text style={screenStyles.recentName}>{user.name}</Text>

                                            {/* DẤU ADD DƯỚI RECENT COLLABORATORS */}
                                            <TouchableOpacity
                                                style={[screenStyles.recentAddIconBtn, isPending && screenStyles.recentCancelIconBtn]}
                                                onPress={() => toggleUserAction(user.id)}
                                            >
                                                <Feather name={isPending ? "x" : "plus"} size={14} color={isPending ? "#707B81" : "#FFFFFF"} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

