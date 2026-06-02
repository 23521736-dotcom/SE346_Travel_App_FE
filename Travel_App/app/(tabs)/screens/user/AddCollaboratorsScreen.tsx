import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import { getApiErrorMessage } from '../../../../lib/api/client';
import {
    type ApiTripMemberRecommendation,
    fetchTripMemberRecommendations,
    inviteTripMember,
    mapApiTripToDraft,
    removeTripInvitation,
    upsertTripToBackend
} from '../../../../lib/api/trips';
import { useAuth } from '../../context/AuthContext';
import { Collaborator, normalizeTripDays, TripData, upsertTripDraft } from '../../store/tripDraftStore';
import screenStyles from './AddCollaboratorsScreen.style';

function getPersonKey(person?: Pick<Collaborator, 'id' | 'userId'> | null) {
    return person?.userId !== undefined && person.userId !== null ? String(person.userId) : String(person?.id ?? '');
}

function getTripOwnerId(trip?: TripData) {
    return trip?.ownerId ?? trip?.createdBy ?? trip?.userId ?? trip?.owner?.userId ?? trip?.owner?.id;
}

export default function AddCollaboratorsScreen({ navigation, route }: any) {
    const trip = route?.params?.tripData as TripData | undefined;
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [recommendations, setRecommendations] = useState<ApiTripMemberRecommendation[]>([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
    const [recommendationActionByUser, setRecommendationActionByUser] = useState<Record<number, boolean>>({});
    const [selectedOwnerId, setSelectedOwnerId] = useState<string | undefined>(() => {
        const ownerId = getTripOwnerId(trip);
        return ownerId === undefined || ownerId === null ? undefined : String(ownerId);
    });

    const currentUserId = user?.id === undefined || user?.id === null ? undefined : String(user.id);
    const originalOwnerId = getTripOwnerId(trip) === undefined ? undefined : String(getTripOwnerId(trip));
    const tripOwnerId = selectedOwnerId ?? originalOwnerId;
    const canManageTrip = Boolean(currentUserId) && (!originalOwnerId || originalOwnerId === currentUserId);
    const tripId = trip?.id;

    useEffect(() => {
        if (!tripId || !currentUserId) {
            setRecommendations([]);
            return;
        }

        let isActive = true;
        const timeoutId = setTimeout(async () => {
            setIsLoadingRecommendations(true);
            try {
                const nextRecommendations = await fetchTripMemberRecommendations(
                    tripId,
                    currentUserId,
                    searchQuery
                );

                if (isActive) {
                    setRecommendations(nextRecommendations);
                }
            } catch (error) {
                if (isActive) {
                    setRecommendations([]);
                    Alert.alert('Unable to load users', getApiErrorMessage(error));
                }
            } finally {
                if (isActive) {
                    setIsLoadingRecommendations(false);
                }
            }
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [currentUserId, searchQuery, tripId]);

    const confirmTransferOwner = (member: Collaborator) => {
        if (!canManageTrip || getPersonKey(member) === currentUserId) {
            return;
        }

        Alert.alert(
            'Change trip owner?',
            `Transfer owner permission to ${member.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: () => setSelectedOwnerId(getPersonKey(member)),
                },
            ]
        );
    };

    const saveCollaborators = async () => {
        if (isSaving) {
            return;
        }

        if (!trip) {
            navigation.goBack();
            return;
        }

        const members: Collaborator[] = trip.members || [];
        const newOwner = members.find((member) => getPersonKey(member) === selectedOwnerId) ?? trip.owner;
        const updatedTrip = {
            ...trip,
            ownerId: selectedOwnerId ?? tripOwnerId,
            owner: newOwner,
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
                ownerId: updatedTrip.ownerId,
                owner: updatedTrip.owner,
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
            Alert.alert('Unable to save members', getApiErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    const handleRecommendationAction = async (candidate: ApiTripMemberRecommendation) => {
        if (!canManageTrip || !tripId || recommendationActionByUser[candidate.userId]) {
            return;
        }

        setRecommendationActionByUser((prev) => ({ ...prev, [candidate.userId]: true }));
        try {
            if (candidate.isInvitedByUser) {
                await removeTripInvitation(tripId, candidate.userId);
            } else {
                await inviteTripMember(tripId, candidate.userId);
            }

            setRecommendations((prev) =>
                prev.map((item) =>
                    item.userId === candidate.userId
                        ? { ...item, isInvitedByUser: !candidate.isInvitedByUser }
                        : item
                )
            );
        } catch (error) {
            Alert.alert(
                candidate.isInvitedByUser ? 'Unable to remove invitation' : 'Unable to invite user',
                getApiErrorMessage(error)
            );
        } finally {
            setRecommendationActionByUser((prev) => ({ ...prev, [candidate.userId]: false }));
        }
    };

    const renderAvatar = (avatarUrl: string | null, name: string, size: 'large' | 'medium' = 'large') => {
        const avatarStyle = size === 'large' ? screenStyles.avatarLarge : screenStyles.avatarMedium;

        if (avatarUrl) {
            return <Image source={{ uri: avatarUrl }} style={avatarStyle} />;
        }

        return (
            <View style={[avatarStyle, screenStyles.avatarFallback]}>
                <Text style={screenStyles.avatarFallbackText}>{name.trim().charAt(0).toUpperCase() || '?'}</Text>
            </View>
        );
    };

    const renderInviteButton = (candidate: ApiTripMemberRecommendation) => {
        if (!canManageTrip) {
            return null;
        }

        const isInvited = candidate.isInvitedByUser;
        const isActionLoading = Boolean(recommendationActionByUser[candidate.userId]);

        return (
            <TouchableOpacity
                style={[
                    screenStyles.actionBtn,
                    isInvited ? screenStyles.cancelBtn : null,
                    isActionLoading ? { opacity: 0.6 } : null
                ]}
                onPress={() => handleRecommendationAction(candidate)}
                disabled={isActionLoading}
            >
                <Feather name={isInvited ? 'user-minus' : 'user-plus'} size={15} color={isInvited ? '#707B81' : '#FFFFFF'} />
                <Text style={[
                    screenStyles.actionBtnText,
                    isInvited ? screenStyles.cancelBtnText : null
                ]}>
                    {isActionLoading ? '...' : isInvited ? 'Remove' : 'Invite'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={screenStyles.container}>
            <View style={screenStyles.scrollContent}>
                <View style={screenStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#003A70" />
                    </TouchableOpacity>
                    <Text style={screenStyles.headerTitle}>Add Collaborators</Text>
                    <TouchableOpacity onPress={saveCollaborators} disabled={isSaving || !canManageTrip}>
                        <Text style={[screenStyles.saveText, (isSaving || !canManageTrip) && { opacity: 0.45 }]}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={screenStyles.searchContainer}>
                    <Feather name="search" size={20} color="#8E9EAB" />
                    <TextInput
                        style={[screenStyles.searchInput, { outline: 'none' } as any]}
                        placeholder="Search by name..."
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
                    <View>
                        <View style={screenStyles.sectionHeader}>
                            <Text style={screenStyles.sectionTitle}>
                                {searchQuery.trim().length > 0 ? 'Search Results' : 'Suggested'}
                            </Text>
                        </View>

                        {isLoadingRecommendations ? (
                            <Text style={screenStyles.noResultText}>Loading users...</Text>
                        ) : recommendations.length > 0 ? (
                            recommendations.map((userItem) => (
                                <View key={userItem.userId} style={screenStyles.card}>
                                    {renderAvatar(userItem.avatarUrl, userItem.name)}
                                    <View style={screenStyles.cardTextContainer}>
                                        <Text style={screenStyles.userName}>{userItem.name}</Text>
                                        <Text style={screenStyles.userEmail}>
                                            {userItem.commonTripCount} common trips
                                        </Text>
                                    </View>
                                    {renderInviteButton(userItem)}
                                </View>
                            ))
                        ) : (
                            <Text style={screenStyles.noResultText}>No users found.</Text>
                        )}

                        <View style={[screenStyles.sectionHeader, { marginTop: 24 }]}>
                            <Text style={screenStyles.sectionTitle}>Members</Text>
                        </View>

                        {(trip?.members || []).length > 0 ? (
                            <View style={screenStyles.recentRow}>
                                {(trip?.members || []).map((member) => {
                                    const canTransferOwner =
                                        canManageTrip &&
                                        getPersonKey(member) !== currentUserId &&
                                        getPersonKey(member) !== tripOwnerId;

                                    return (
                                        <TouchableOpacity
                                            key={`${member.id}-${member.userId ?? ''}`}
                                            style={screenStyles.recentItem}
                                            onPress={() => confirmTransferOwner(member)}
                                            disabled={!canTransferOwner}
                                        >
                                            {renderAvatar(member.avatar || null, member.name, 'medium')}
                                            <Text style={screenStyles.recentName} numberOfLines={1}>
                                                {member.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text style={screenStyles.noResultText}>No members yet.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
