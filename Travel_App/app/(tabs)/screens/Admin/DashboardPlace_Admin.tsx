import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from './DashboardPlace_Admin.style';
import { useAuth } from '../../context/AuthContext';
import {
    fetchAdminPlaces,
    approvePlace,
    rejectPlace,
    deleteAdminPlace,
    type AdminPlace
} from '../../../../lib/api/admin';

const STATUS_TAB_MAP: Record<string, 'APPROVED' | 'PENDING' | 'REJECTED' | undefined> = {
    'Active Places': 'APPROVED',
    'Pending Approval': 'PENDING',
    'Rejected': 'REJECTED',
};

function getStatusLabel(status: string) {
    switch (status) {
        case 'APPROVED':
            return { text: 'Verified Place', color: '#14532d', bgColor: '#bbf7d0' };
        case 'PENDING':
            return { text: 'Pending Approval', color: '#713f12', bgColor: '#fef08a' };
        case 'REJECTED':
            return { text: 'Rejected', color: '#991b1b', bgColor: '#fecaca' };
        default:
            return { text: 'Unknown', color: '#525252', bgColor: '#e4e4e7' };
    }
}

export default function DashboardPlace_Admin({ navigation }: any) {
    const { logout } = useAuth();

    const tabs = ['Active Places', 'Pending Approval', 'Rejected'];

    const [activeTab, setActiveTab] = useState<string>('Active Places');
    const [places, setPlaces] = useState<AdminPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDescIds, setExpandedDescIds] = useState<string[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Rejection reason modal
    const [rejectModalPlaceId, setRejectModalPlaceId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const loadPlaces = useCallback(async () => {
        try {
            setLoading(true);
            const statusFilter = STATUS_TAB_MAP[activeTab];
            const response = await fetchAdminPlaces({ status: statusFilter });
            setPlaces(response.items);
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to load places');
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useFocusEffect(
        useCallback(() => {
            loadPlaces();
        }, [loadPlaces])
    );

    const toggleDescription = (id: string) => {
        if (expandedDescIds.includes(id)) {
            setExpandedDescIds(expandedDescIds.filter(itemId => itemId !== id));
        } else {
            setExpandedDescIds([...expandedDescIds, id]);
        }
    };

    const handleApprove = async (placeId: string) => {
        try {
            setActionLoading(true);
            await approvePlace(placeId);
            Alert.alert('Success', 'Place has been approved and is now visible to travelers.');
            loadPlaces();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to approve place');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectPress = (placeId: string) => {
        setRejectionReason('');
        setRejectModalPlaceId(placeId);
    };

    const handleRejectConfirm = async () => {
        if (!rejectModalPlaceId) return;
        try {
            setActionLoading(true);
            await rejectPlace(rejectModalPlaceId, rejectionReason.trim() || undefined);
            Alert.alert('Success', 'Place has been rejected.');
            setRejectModalPlaceId(null);
            setRejectionReason('');
            loadPlaces();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to reject place');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (placeId: string, placeName: string) => {
        Alert.alert(
            'Delete Place',
            `Are you sure you want to delete "${placeName}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await deleteAdminPlace(placeId);
                            Alert.alert('Success', 'Place has been deleted.');
                            loadPlaces();
                        } catch (err: any) {
                            Alert.alert('Error', err?.message || 'Failed to delete place');
                        } finally {
                            setActionLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentArea}>
                    <View style={styles.tabContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#0284c7" />
                            <Text style={{ marginTop: 12, color: '#71717a' }}>Loading places...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={loadPlaces}
                                    colors={["#0284c7"]}
                                    tintColor="#0284c7"
                                />
                            }
                        >
                            {places.map((item) => {
                                const isExpanded = expandedDescIds.includes(item.Id);
                                const label = getStatusLabel(item.Status);

                                return (
                                    <View key={item.Id} style={styles.card}>
                                        <TouchableOpacity
                                            style={styles.imageContainer}
                                            activeOpacity={0.9}
                                            onPress={() => setPreviewImage(item.CoverImageUrl)}
                                        >
                                            <Image source={{ uri: item.CoverImageUrl }} style={styles.cardImage} />
                                            <View style={[styles.cardLabel, { backgroundColor: label.bgColor }]}>
                                                <Text style={[styles.cardLabelText, { color: label.color }]}>
                                                    {label.text}
                                                </Text>
                                            </View>
                                            <View style={styles.zoomIconContainer}>
                                                <Text style={styles.zoomIcon}>🔍</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <Text style={styles.cardTitle}>{item.Name}</Text>
                                        <View style={styles.userRow}>
                                            <View style={styles.userAvatarMock} />
                                            <Text style={styles.userName}>
                                                {item.Owner ? `@${item.Owner.Name}` : 'Unknown Owner'}
                                            </Text>
                                        </View>

                                        {item.About ? (
                                            <>
                                                <Text
                                                    style={styles.cardDesc}
                                                    numberOfLines={isExpanded ? undefined : 3}
                                                >
                                                    {item.About}
                                                </Text>
                                                <TouchableOpacity onPress={() => toggleDescription(item.Id)}>
                                                    <Text style={styles.readMoreBtn}>
                                                        {isExpanded ? 'Show less' : 'Read more'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </>
                                        ) : null}

                                        {item.RejectionReason && (
                                            <View style={{ backgroundColor: '#fef2f2', padding: 10, borderRadius: 8, marginTop: 8 }}>
                                                <Text style={{ color: '#991b1b', fontSize: 12, fontWeight: '600' }}>
                                                    Rejection Reason:
                                                </Text>
                                                <Text style={{ color: '#7f1d1d', fontSize: 13, marginTop: 2 }}>
                                                    {item.RejectionReason}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.actionRow}>
                                            {item.Status === 'APPROVED' && (
                                                <TouchableOpacity
                                                    style={[styles.actionBtn, styles.btnDelete]}
                                                    onPress={() => handleDelete(item.Id, item.Name)}
                                                    disabled={actionLoading}
                                                >
                                                    <Text style={styles.navIconMock}>🗑️ </Text>
                                                    <Text style={styles.btnDeleteText}>Delete Place</Text>
                                                </TouchableOpacity>
                                            )}
                                            {item.Status === 'PENDING' && (
                                                <>
                                                    <TouchableOpacity
                                                        style={[styles.actionBtn, styles.btnApprove]}
                                                        onPress={() => handleApprove(item.Id)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Text style={styles.btnApproveText}>
                                                            {actionLoading ? 'Processing...' : 'Approve'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.actionBtn, styles.btnReject]}
                                                        onPress={() => handleRejectPress(item.Id)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Text style={styles.btnRejectText}>Reject</Text>
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                            {item.Status === 'REJECTED' && (
                                                <TouchableOpacity
                                                    style={[styles.actionBtn, styles.btnDelete]}
                                                    onPress={() => handleDelete(item.Id, item.Name)}
                                                    disabled={actionLoading}
                                                >
                                                    <Text style={styles.navIconMock}>🗑️ </Text>
                                                    <Text style={styles.btnDeleteText}>Delete Place</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}

                            {places.length === 0 && (
                                <Text style={styles.emptyText}>No destinations found in this category.</Text>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>

            {/* Image Preview Modal */}
            <Modal
                visible={previewImage !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPreviewImage(null)}
            >
                <View style={styles.modalBackground}>
                    <TouchableOpacity
                        style={styles.closeModalBtn}
                        onPress={() => setPreviewImage(null)}
                    >
                        <Text style={styles.closeModalText}>✕ Close</Text>
                    </TouchableOpacity>

                    {previewImage && (
                        <Image
                            source={{ uri: previewImage }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>

            {/* Rejection Reason Modal */}
            <Modal
                visible={rejectModalPlaceId !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRejectModalPlaceId(null)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxWidth: 400,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#09090b', marginBottom: 8 }}>
                            Reject Place
                        </Text>
                        <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 16 }}>
                            Please provide a reason for rejection (optional):
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#e4e4e7',
                                borderRadius: 12,
                                padding: 12,
                                fontSize: 14,
                                minHeight: 80,
                                textAlignVertical: 'top',
                                marginBottom: 16,
                            }}
                            placeholder="e.g. Incomplete information, low quality images..."
                            placeholderTextColor="#a1a1aa"
                            multiline
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                            <TouchableOpacity
                                onPress={() => setRejectModalPlaceId(null)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: '#f4f4f5',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#52525b' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRejectConfirm}
                                disabled={actionLoading}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: '#dc2626',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                                    {actionLoading ? 'Rejecting...' : 'Reject'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
