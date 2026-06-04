import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
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

type UserTab = 'Active Accounts' | 'Banned Accounts';

const tabs: UserTab[] = ['Active Accounts', 'Banned Accounts'];
const ITEMS_PER_PAGE = 10;
const USERS_FETCH_BATCH_SIZE = 100;

function parseDateValue(value?: string | number | null) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (typeof value === 'number' || /^\d+$/.test(value)) {
        const timestamp = Number(value);
        const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const slashDateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashDateMatch) {
        const [, day, month, year] = slashDateMatch;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatJoinedDate(dateString?: string | null) {
    const date = parseDateValue(dateString);
    if (!date) {
        return 'Joined date unavailable';
    }

    return `Joined ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

function getRoleBadgeColor(role: string) {
    switch (role) {
        case 'ADMIN':
            return { text: 'Admin', color: '#7c2d12', bgColor: '#ffedd5' };
        case 'OWNER':
            return { text: 'Owner', color: '#166534', bgColor: '#dcfce7' };
        case 'TRAVELER':
            return { text: 'Traveler', color: '#075985', bgColor: '#e0f2fe' };
        default:
            return { text: 'Unknown', color: '#525252', bgColor: '#e4e4e7' };
    }
}

function getStatusCopy(isBanned: boolean) {
    return isBanned
        ? { label: 'Banned', icon: 'lock-closed-outline' as const }
        : { label: 'Active', icon: 'checkmark-circle-outline' as const };
}

function matchesUserSearch(user: AdminUser, search: string) {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
        return true;
    }

    return [
        user.fullName,
        user.username,
        user.email,
        user.role,
    ].some((value) => value?.toLowerCase().includes(normalizedSearch));
}

async function fetchAllAdminUsers(search: string) {
    const allUsers: AdminUser[] = [];
    let offset = 0;
    let expectedTotal: number | null = null;

    do {
        const response = await fetchAdminUsers({
            search: search.trim() || undefined,
            limit: USERS_FETCH_BATCH_SIZE,
            offset,
        });

        const nextItems = response.items.filter((user) => matchesUserSearch(user, search));
        allUsers.push(...nextItems);

        expectedTotal = response.meta.total;
        offset += response.items.length;

        if (response.items.length < USERS_FETCH_BATCH_SIZE) {
            break;
        }
    } while (expectedTotal === null || offset < expectedTotal);

    return allUsers;
}

export default function DashboardUser_Admin() {
    const { logout } = useAuth();

    const [activeTab, setActiveTab] = useState<UserTab>('Active Accounts');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

    const [roleModalUserId, setRoleModalUserId] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState<'TRAVELER' | 'OWNER' | 'ADMIN'>('TRAVELER');
    const [actionLoading, setActionLoading] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isBannedTab = activeTab === 'Banned Accounts';

    const loadUsers = useCallback(async (page = currentPage, search = searchQuery, tab = activeTab, quiet = false) => {
        try {
            if (!quiet) setLoading(true);
            const allUsers = await fetchAllAdminUsers(search);
            const tabUsers = allUsers.filter((user) => user.isBanned === (tab === 'Banned Accounts'));
            const nextTotalPages = Math.max(1, Math.ceil(tabUsers.length / ITEMS_PER_PAGE));
            const safePage = Math.min(Math.max(1, page), nextTotalPages);
            const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

            setUsers(tabUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE));
            setTotalUsers(tabUsers.length);
            setTotalPages(nextTotalPages);
            if (safePage !== page) {
                setCurrentPage(safePage);
            }
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to load users');
            setUsers([]);
            setTotalUsers(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, currentPage, searchQuery]);

    useFocusEffect(
        useCallback(() => {
            loadUsers();
        }, [loadUsers])
    );

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        setCurrentPage(1);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            loadUsers(1, text);
        }, 300);
    };

    const handleTabChange = (tab: UserTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        loadUsers(1, searchQuery, tab);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadUsers(currentPage, searchQuery, activeTab, true);
    };

    const updateBanStatus = async (user: AdminUser, nextIsBanned: boolean) => {
        try {
            setUpdatingUserId(user.id);
            await banUser(user.id, nextIsBanned);

            setUsers((current) => current.filter((item) => item.id !== user.id));
            setTotalUsers((total) => Math.max(0, total - 1));

            const remainingOnPage = users.length - 1;
            const shouldStepBack = remainingOnPage === 0 && currentPage > 1;
            const nextPage = shouldStepBack ? currentPage - 1 : currentPage;
            if (shouldStepBack) setCurrentPage(nextPage);

            await loadUsers(nextPage, searchQuery, activeTab, true);
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to update user status');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleStatusPress = (user: AdminUser) => {
        const nextIsBanned = !user.isBanned;
        Alert.alert(
            nextIsBanned ? 'Ban account?' : 'Active account?',
            nextIsBanned
                ? `${getDisplayName(user)} will move to Banned Accounts.`
                : `${getDisplayName(user)} will move back to Active Accounts.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: nextIsBanned ? 'Ban' : 'Active',
                    style: nextIsBanned ? 'destructive' : 'default',
                    onPress: () => updateBanStatus(user, nextIsBanned),
                },
            ]
        );
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
            setRoleModalUserId(null);
            loadUsers(currentPage, searchQuery, activeTab, true);
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

    const getAvatarUrl = (user: AdminUser) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName(user))}&background=0284c7&color=fff`;
    };

    const startItemIndex = users.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItemIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalUsers);

    const summaryText = useMemo(() => {
        if (loading) return 'Loading accounts';
        return `${totalUsers} ${isBannedTab ? 'banned' : 'active'} account${totalUsers === 1 ? '' : 's'}`;
    }, [isBannedTab, loading, totalUsers]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Ionicons name="log-out-outline" size={16} color="#dc2626" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentArea}>
                    <View style={styles.summaryCard}>
                        <View>
                            <Text style={styles.summaryLabel}>{activeTab}</Text>
                            <Text style={styles.summaryValue}>{summaryText}</Text>
                        </View>
                        <View style={[styles.summaryIconWrap, isBannedTab && styles.summaryIconWrapDanger]}>
                            <Ionicons
                                name={isBannedTab ? 'ban-outline' : 'people-outline'}
                                size={24}
                                color={isBannedTab ? '#dc2626' : '#0284c7'}
                            />
                        </View>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or email"
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                    </View>

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
                        <View style={styles.loadingState}>
                            <ActivityIndicator size="large" color="#0284c7" />
                            <Text style={styles.loadingText}>Loading users...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={['#0284c7']}
                                    tintColor="#0284c7"
                                />
                            }
                        >
                                <View style={styles.cardList}>
                                    {users.map((user) => (
                                        <UserCard
                                            key={user.id}
                                        user={user}
                                        avatarUrl={getAvatarUrl(user)}
                                        joinedText={formatJoinedDate(user.createdAt)}
                                        isUpdating={updatingUserId === user.id}
                                        onStatusPress={() => handleStatusPress(user)}
                                        onRolePress={() => handleRolePress(user.id, user.role)}
                                    />
                                ))}

                                    {users.length === 0 && (
                                        <View style={styles.emptyState}>
                                            <Ionicons name="people-outline" size={34} color="#94a3b8" />
                                            <Text style={styles.emptyTitle}>No users found</Text>
                                            <Text style={styles.emptyText}>
                                                {isBannedTab
                                                    ? 'Banned users will appear here after you ban an active account.'
                                                    : 'Active users will appear here when they are not banned.'}
                                            </Text>
                                        </View>
                                )}

                                {users.length > 0 && (
                                    <View style={styles.paginationRow}>
                                        <Text style={styles.paginationText}>
                                            Showing {startItemIndex} to {endItemIndex} of {totalUsers}
                                        </Text>
                                        <View style={styles.paginationControls}>
                                            <TouchableOpacity
                                                    style={styles.pageArrowBtn}
                                                onPress={handlePrevPage}
                                                disabled={currentPage === 1}
                                            >
                                                    <Ionicons
                                                        name="chevron-back"
                                                        size={18}
                                                        color={currentPage === 1 ? '#cbd5e1' : '#0369a1'}
                                                    />
                                            </TouchableOpacity>

                                                <Text style={styles.pageIndicator}>{currentPage} / {totalPages}</Text>

                                            <TouchableOpacity
                                                    style={styles.pageArrowBtn}
                                                onPress={handleNextPage}
                                                disabled={currentPage === totalPages}
                                            >
                                                    <Ionicons
                                                        name="chevron-forward"
                                                        size={18}
                                                        color={currentPage === totalPages ? '#cbd5e1' : '#0369a1'}
                                                    />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>

            <Modal
                visible={roleModalUserId !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRoleModalUserId(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Change User Role</Text>
                        <Text style={styles.modalBody}>Select the new role for this user.</Text>
                        <View style={styles.roleOptions}>
                            {(['TRAVELER', 'OWNER', 'ADMIN'] as const).map((role) => {
                                const badge = getRoleBadgeColor(role);
                                return (
                                    <TouchableOpacity
                                        key={role}
                                        onPress={() => setSelectedRole(role)}
                                        style={[
                                            styles.roleOption,
                                            selectedRole === role && styles.roleOptionActive
                                        ]}
                                    >
                                        <Text style={styles.roleOptionText}>
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
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={() => setRoleModalUserId(null)}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRoleConfirm}
                                disabled={actionLoading}
                                style={styles.modalPrimaryButton}
                            >
                                <Text style={styles.modalPrimaryText}>
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

function getDisplayName(user: AdminUser) {
    return user.fullName || user.username || user.email.split('@')[0];
}

function UserCard({
    user,
    avatarUrl,
    joinedText,
    isUpdating,
    onStatusPress,
    onRolePress,
}: {
    user: AdminUser;
    avatarUrl: string;
    joinedText: string;
    isUpdating: boolean;
    onStatusPress: () => void;
    onRolePress: () => void;
}) {
    const roleBadge = getRoleBadgeColor(user.role);
    const status = getStatusCopy(user.isBanned);

    return (
        <View style={[styles.userCard, user.isBanned && styles.userCardBanned]}>
            <View style={styles.cardTopRow}>
                <Image source={{ uri: avatarUrl }} style={[styles.avatar, user.isBanned && styles.avatarBanned]} />
                <View style={styles.userMainInfo}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.userName, user.isBanned && styles.textBanned]} numberOfLines={1}>
                            {getDisplayName(user)}
                        </Text>
                        <View style={[styles.statusBadge, user.isBanned && styles.statusBadgeBanned]}>
                            <Ionicons
                                name={status.icon}
                                size={12}
                                color={user.isBanned ? '#dc2626' : '#16a34a'}
                            />
                            <Text style={[styles.statusBadgeText, user.isBanned && styles.statusBadgeTextBanned]}>
                                {status.label}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                    <Text style={styles.userJoined}>{joinedText}</Text>
                </View>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metricPill}>
                    <Text style={styles.metricValue}>{user.ownedPlacesCount}</Text>
                    <Text style={styles.metricLabel}>places</Text>
                </View>
                <View style={styles.metricPill}>
                    <Text style={styles.metricValue}>{user.reviewsCount}</Text>
                    <Text style={styles.metricLabel}>reviews</Text>
                </View>
                <TouchableOpacity
                    onPress={onRolePress}
                    style={[styles.roleBadge, { backgroundColor: roleBadge.bgColor }]}
                >
                    <Text style={[styles.badgeText, { color: roleBadge.color }]}>{roleBadge.text}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.statusBtn, user.isBanned ? styles.btnActive : styles.btnBan]}
                onPress={onStatusPress}
                disabled={isUpdating}
            >
                {isUpdating ? (
                    <ActivityIndicator size="small" color={user.isBanned ? '#166534' : '#ffffff'} />
                ) : (
                    <>
                        <Ionicons
                            name={user.isBanned ? 'checkmark-circle-outline' : 'ban-outline'}
                            size={17}
                            color={user.isBanned ? '#166534' : '#ffffff'}
                        />
                        <Text style={user.isBanned ? styles.btnActiveText : styles.btnBanText}>
                            {user.isBanned ? 'Active' : 'Ban'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}
