import React, { useMemo, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import getStyles from './DashboardUser_Admin.style';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface StatItem {
    id: string;
    title: string;
    value: string;
    color: string;
}

interface UserItem {
    id: string;
    name: string;
    joinedDate: string;
    email: string;
    avatarUrl: string;
    status: 'active' | 'banned';
}

const DashboardUser_Admin: React.FC = () => {
    const { logout } = useAuth();
    const { colors: themeColors, isDark } = useTheme();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);

    const statsData: StatItem[] = [
        { id: '1', title: 'Total Users', value: '12,842', color: themeColors.primary },
        { id: '2', title: 'Reported Accounts', value: '12', color: themeColors.danger },
    ];

    const [users, setUsers] = useState<UserItem[]>([
        { id: '1', name: 'Alex Thompson', joinedDate: 'Joined Oct 2023', email: 'alex.thompson@example.com', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop', status: 'active' },
        { id: '2', name: 'Elena Rodriguez', joinedDate: 'Joined Jan 2024', email: 'e.rodriguez@domain.com', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', status: 'active' },
        { id: '3', name: 'Jordan 1', joinedDate: 'Joined Feb 2024', email: 'jordan_1@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '4', name: 'Jordan 2', joinedDate: 'Joined Feb 2024', email: 'jordan_2@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '5', name: 'Jordan 3', joinedDate: 'Joined Feb 2024', email: 'jordan_3@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '6', name: 'Jordan 4', joinedDate: 'Joined Feb 2024', email: 'jordan_4@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '7', name: 'Jordan 5', joinedDate: 'Joined Feb 2024', email: 'jordan_5@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '8', name: 'Jordan 6', joinedDate: 'Joined Feb 2024', email: 'jordan_6@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '9', name: 'Jordan 7', joinedDate: 'Joined Feb 2024', email: 'jordan_7@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '10', name: 'Jordan 8', joinedDate: 'Joined Feb 2024', email: 'jordan_8@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '11', name: 'Jordan 9', joinedDate: 'Joined Feb 2024', email: 'jordan_9@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '12', name: 'Jordan 10', joinedDate: 'Joined Feb 2024', email: 'jordan_10@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '13', name: 'Jordan 11', joinedDate: 'Joined Feb 2024', email: 'jordan_11@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '14', name: 'Jordan 12', joinedDate: 'Joined Feb 2024', email: 'jordan_12@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '15', name: 'Jordan 13', joinedDate: 'Joined Feb 2024', email: 'jordan_13@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
        { id: '16', name: 'Jordan 14', joinedDate: 'Joined Feb 2024', email: 'jordan_14@web.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', status: 'banned' },
    ]);

    const userTabs = ['Active Accounts', 'Banned Accounts'];
    const [activeUserTab, setActiveUserTab] = useState<string>('Active Accounts');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 10;

    const handleTabChange = (tab: string) => {
        setActiveUserTab(tab);
        setCurrentPage(1);
    };

    const displayedUsers = users.filter(user => {
        if (activeUserTab === 'Active Accounts') return user.status === 'active';
        if (activeUserTab === 'Banned Accounts') return user.status === 'banned';
        return true;
    });

    const totalPages = Math.ceil(displayedUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = displayedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const startItemIndex = displayedUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItemIndex = Math.min(currentPage * ITEMS_PER_PAGE, displayedUsers.length);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const toggleUserStatus = (userId: string, currentStatus: string) => {
        const isBanning = currentStatus === 'active';

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, status: isBanning ? 'banned' : 'active' }
                    : user
            )
        );

        if (paginatedUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={themeColors.background} />

            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.statsContainer}>
                        {statsData.map((stat) => (
                            <View key={stat.id} style={styles.statCard}>
                                <Text style={styles.statTitle}>{stat.title}</Text>
                                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or email..."
                            placeholderTextColor={themeColors.textMuted}
                        />
                    </View>

                    <View style={styles.tabContainer}>
                        {userTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => handleTabChange(tab)}
                                style={[styles.tabButton, activeUserTab === tab && styles.tabButtonActive]}
                            >
                                <Text style={[styles.tabText, activeUserTab === tab && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.tableCard}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>User Profile</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.4 }]}>Email</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.6, textAlign: 'center' }]}>Action</Text>
                        </View>

                        {paginatedUsers.map((user, index) => (
                            <View
                                key={user.id}
                                style={[styles.tableRow, index === paginatedUsers.length - 1 && { borderBottomWidth: 0 }]}
                            >
                                <View style={styles.userInfoCol}>
                                    <Image
                                        source={{ uri: user.avatarUrl }}
                                        style={[styles.avatar, user.status === 'banned' && styles.avatarBanned]}
                                    />
                                    <View style={styles.userNameBlock}>
                                        <Text style={[styles.userName, user.status === 'banned' && styles.textBanned]} numberOfLines={1}>
                                            {user.name}
                                        </Text>
                                        <Text style={styles.userJoined}>{user.joinedDate}</Text>
                                    </View>
                                </View>

                                <View style={styles.userEmailCol}>
                                    <Text style={styles.userEmail} numberOfLines={2} ellipsizeMode="tail">
                                        {user.email}
                                    </Text>
                                </View>

                                <View style={styles.userActionCol}>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusBtn,
                                            user.status === 'active' ? styles.btnBan : styles.btnUnban
                                        ]}
                                        onPress={() => toggleUserStatus(user.id, user.status)}
                                    >
                                        <Text style={user.status === 'active' ? styles.btnBanText : styles.btnUnbanText}>
                                            {user.status === 'active' ? 'Ban' : 'Unban'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {displayedUsers.length === 0 && (
                            <Text style={styles.emptyText}>No users found in this category.</Text>
                        )}

                        {displayedUsers.length > 0 && (
                            <View style={styles.paginationRow}>
                                <Text style={styles.paginationText}>
                                    Showing {startItemIndex} to {endItemIndex} of {displayedUsers.length}
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
                                            onPress={() => setCurrentPage(pageNumber)}
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
            </View>
        </SafeAreaView>
    );
};

export default DashboardUser_Admin;
