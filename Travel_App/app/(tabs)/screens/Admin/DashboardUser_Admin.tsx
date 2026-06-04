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

import { styles } from './DashboardUser_Admin.style';
import { useAuth } from '../../context/AuthContext';
import {
    fetchAdminUsers,
    banUser,
    changeUserRole,
    type AdminUser
} from '../../../../lib/api/admin';

function getRoleBadgeColor(role: string) {
    switch (role) {
        case 'ADMIN':
            return { text: 'Admin', color: '#713f12', bgColor: '#fef08a' };
        case 'OWNER':
            return { text: 'Owner', color: '#14532d', bgColor: '#bbf7d0' };
        case 'TRAVELER':
            return { text: 'Traveler', color: '#1e3a8a', bgColor: '#bfdbfe' };
        default:
            return { text: 'Unknown', color: '#525252', bgColor: '#e4e4e7' };
    }
}

function getStatusBadge(isBanned: boolean) {
    if (isBanned) {
        return { text: 'Banned', color: '#991b1b', bgColor: '#fecaca' };
    }
    return { text: 'Active', color: '#14532d', bgColor: '#bbf7d0' };
}

export default function DashboardUser_Admin({ navigation }: any) {
    const { logout } = useAuth();

    const tabs = ['Active Accounts', 'Banned Accounts'];
    const [activeTab, setActiveTab] = useState<string>('Active Accounts');

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [totalPages, setTotalPages] = useState(1);

    // Ban/Unban modal
    const [banModalUserId, setBanModalUserId] = useState<number | null>(null);
    const [banReason, setBanReason] = useState('');
    const [isBanning, setIsBanning] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Change role modal
    const [roleModalUserId, setRoleModalUserId] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState<'TRAVELER' | 'OWNER' | 'ADMIN'>('TRAVELER');

    const loadUsers = useCallback(async (page?: number, search?: string) => {
        try {
            setLoading(true);
            const pageNum = page ?? currentPage;
            const searchVal = search ?? searchQuery;
            const offset = (pageNum - 1) * ITEMS_PER_PAGE;

            const response = await fetchAdminUsers({
                search: searchVal || undefined,
                limit: ITEMS_PER_PAGE,
                offset,
            });

            // Filter users based on active tab
            const filteredUsers = response.items.filter(user => {
                if (activeTab === 'Active Accounts') return !user.isBanned;
                if (activeTab === 'Banned Accounts') return user.isBanned;
                return true;
            });

            setUsers(filteredUsers);
            setTotalUsers(response.meta.total);
            setTotalPages(Math.ceil(response.meta.total / ITEMS_PER_PAGE));
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, activeTab]);

    useFocusEffect(
        useCallback(() => {
            loadUsers();
        }, [loadUsers])
    );

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setCurrentPage(1);
        // Debounce search
        const timeoutId = setTimeout(() => {
            loadUsers(1, text);
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleBanPress = (userId: number, currentIsBanned: boolean) => {
        setBanModalUserId(userId);
        setIsBanning(!currentIsBanned);
        setBanReason('');
    };

    const handleBanConfirm = async () => {
        if (!banModalUserId) return;
        try {
            setActionLoading(true);
            await banUser(banModalUserId, isBanning, banReason.trim() || undefined);
            Alert.alert(
                'Success',
                isBanning ? 'User has been banned.' : 'User has been unbanned.'
            );
            setBanModalUserId(null);
            setBanReason('');
            loadUsers();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to update user status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRolePress = (userId: number, currentRole: string) => {
        setRoleModalUserId(userId);
        setSelectedRole(currentRole as 'TRAVELER' | 'OWNER' | 'ADMIN');
    };

    const handleRoleConfirm = async () => {
        if (!roleModalUserId) return;
        try {
            setActionLoading(true);
            await changeUserRole(roleModalUserId, selectedRole);
            Alert.alert('Success', 'User role has been updated.');
            setRoleModalUserId(null);
            loadUsers();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to update user role');
        } finally {
            setActionLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadUsers(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            loadUsers(prevPage);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `Joined ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    };

    const getAvatarUrl = (user: AdminUser) => {
        // Use a placeholder avatar since we don't have avatarUrl in the AdminUser type
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || user.email)}&background=0D8ABC&color=fff`;
    };

    const getDisplayName = (user: AdminUser) => {
        return user.fullName || user.username || user.email.split('@')[0];
    };

    const startItemIndex = users.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItemIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalUsers);

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
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name, email..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => handleTabChange(tab)}
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
                            <Text style={{ marginTop: 12, color: '#71717a' }}>Loading users...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={() => loadUsers()}
                                    colors={["#0284c7"]}
                                    tintColor="#0284c7"
                                />
                            }
                        >
                            {/* Users Table */}
                            <View style={styles.tableCard}>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>User Profile</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Email</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Role</Text>
                                    <Text style={[styles.tableHeaderText, { flex: 0.6, textAlign: 'center' }]}>Action</Text>
                                </View>

                                {users.map((user, index) => {
                                    const roleBadge = getRoleBadgeColor(user.role);
                                    const statusBadge = getStatusBadge(user.isBanned);

                                    return (
                                        <View
                                            key={user.id}
                                            style={[styles.tableRow, index === users.length - 1 && { borderBottomWidth: 0 }]}
                                        >
                                            {/* Profile Column */}
                                            <View style={styles.userInfoCol}>
                                                <Image
                                                    source={{ uri: getAvatarUrl(user) }}
                                                    style={[styles.avatar, user.isBanned && styles.avatarBanned]}
                                                />
                                                <View style={styles.userNameBlock}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                        <Text style={[styles.userName, user.isBanned && styles.textBanned]} numberOfLines={1}>
                                                            {getDisplayName(user)}
                                                        </Text>
                                                        <View style={[styles.badge, { backgroundColor: statusBadge.bgColor }]}>
                                                            <Text style={[styles.badgeText, { color: statusBadge.color }]}>
                                                                {statusBadge.text}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.userJoined}>{formatDate(user.createdAt)}</Text>
                                                    <Text style={styles.userStats}>
                                                        {user.ownedPlacesCount} places · {user.reviewsCount} reviews
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Email Column */}
                                            <View style={styles.userEmailCol}>
                                                <Text style={styles.userEmail} numberOfLines={2} ellipsizeMode="tail">
                                                    {user.email}
                                                </Text>
                                            </View>

                                            {/* Role Column */}
                                            <View style={styles.userRoleCol}>
                                                <TouchableOpacity
                                                    onPress={() => handleRolePress(user.id, user.role)}
                                                    style={[styles.badge, { backgroundColor: roleBadge.bgColor }]}
                                                >
                                                    <Text style={[styles.badgeText, { color: roleBadge.color }]}>
                                                        {roleBadge.text}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Action Column */}
                                            <View style={styles.userActionCol}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.statusBtn,
                                                        user.isBanned ? styles.btnUnban : styles.btnBan
                                                    ]}
                                                    onPress={() => handleBanPress(user.id, user.isBanned)}
                                                >
                                                    <Text style={user.isBanned ? styles.btnUnbanText : styles.btnBanText}>
                                                        {user.isBanned ? 'Unban' : 'Ban'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}

                                {users.length === 0 && (
                                    <Text style={styles.emptyText}>No users found.</Text>
                                )}

                                {/* Pagination */}
                                {users.length > 0 && (
                                    <View style={styles.paginationRow}>
                                        <Text style={styles.paginationText}>
                                            Showing {startItemIndex} to {endItemIndex} of {totalUsers}
                                        </Text>
                                        <View style={styles.paginationControls}>
                                            <TouchableOpacity
                                                onPress={handlePrevPage}
                                                disabled={currentPage === 1}
                                            >
                                                <Text style={[styles.pageArrow, currentPage === 1 && styles.pageArrowDisabled]}>{'<'}</Text>
                                            </TouchableOpacity>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                                <TouchableOpacity
                                                    key={pageNumber}
                                                    style={[styles.pageNumberBtn, currentPage === pageNumber && styles.pageNumberActive]}
                                                    onPress={() => {
                                                        setCurrentPage(pageNumber);
                                                        loadUsers(pageNumber);
                                                    }}
                                                >
                                                    <Text style={[styles.pageNumberText, currentPage === pageNumber && styles.pageNumberTextActive]}>
                                                        {pageNumber}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}

                                            <TouchableOpacity
                                                onPress={handleNextPage}
                                                disabled={currentPage === totalPages}
                                            >
                                                <Text style={[styles.pageArrow, currentPage === totalPages && styles.pageArrowDisabled]}>{'>'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>

            {/* Ban/Unban Modal */}
            <Modal
                visible={banModalUserId !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setBanModalUserId(null)}
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
                            {isBanning ? 'Ban User' : 'Unban User'}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 16 }}>
                            {isBanning
                                ? 'Please provide a reason for banning this user (optional):'
                                : 'Are you sure you want to unban this user?'}
                        </Text>
                        {isBanning && (
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
                                placeholder="e.g. Violation of community guidelines..."
                                placeholderTextColor="#a1a1aa"
                                multiline
                                value={banReason}
                                onChangeText={setBanReason}
                            />
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                            <TouchableOpacity
                                onPress={() => setBanModalUserId(null)}
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
                                onPress={handleBanConfirm}
                                disabled={actionLoading}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: isBanning ? '#dc2626' : '#0284c7',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                                    {actionLoading ? 'Processing...' : (isBanning ? 'Ban' : 'Unban')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Role Modal */}
            <Modal
                visible={roleModalUserId !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRoleModalUserId(null)}
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
                            Change User Role
                        </Text>
                        <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 16 }}>
                            Select the new role for this user:
                        </Text>
                        <View style={{ gap: 8, marginBottom: 16 }}>
                            {(['TRAVELER', 'OWNER', 'ADMIN'] as const).map((role) => {
                                const badge = getRoleBadgeColor(role);
                                return (
                                    <TouchableOpacity
                                        key={role}
                                        onPress={() => setSelectedRole(role)}
                                        style={[
                                            {
                                                borderWidth: 2,
                                                borderColor: selectedRole === role ? '#0284c7' : '#e4e4e7',
                                                borderRadius: 12,
                                                padding: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }
                                        ]}
                                    >
                                        <Text style={{ fontSize: 15, fontWeight: '500', color: '#09090b' }}>
                                            {role.charAt(0) + role.slice(1).toLowerCase()}
                                        </Text>
                                        <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                                            <Text style={[styles.badgeText, { color: badge.color }]}>
                                                {badge.text}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                            <TouchableOpacity
                                onPress={() => setRoleModalUserId(null)}
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
                                onPress={handleRoleConfirm}
                                disabled={actionLoading}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: '#0284c7',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                                    {actionLoading ? 'Updating...' : 'Update Role'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
