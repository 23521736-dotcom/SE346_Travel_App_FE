import React, { useState } from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { styles } from './DashboardPlace_Admin.style';

interface ContentItem {
    id: string;
    status: 'active' | 'pending';
    label: { text: string; color: string; bgColor: string };
    imageUrl: string;
    title: string;
    username: string;
    description: string;
}

export default function DashboardPlace_Admin({ navigation }: any) {
    const mockContentItems: ContentItem[] = [
        // --- CÁC ĐỊA ĐIỂM ĐANG HOẠT ĐỘNG (ACTIVE) ---
        {
            id: '1',
            status: 'active',
            label: { text: 'Verified Place', color: '#14532d', bgColor: '#bbf7d0' },
            imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop',
            title: 'Hoi An Ancient Town',
            username: '@vietnam_travel',
            description: 'UNESCO World Heritage site. Known for its well-preserved Ancient Town, mixed cultural heritage, and beautiful lantern-lit nights.',
        },
        {
            id: '2',
            status: 'active',
            label: { text: 'Verified Place', color: '#14532d', bgColor: '#bbf7d0' },
            imageUrl: 'https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?q=80&w=600&auto=format&fit=crop',
            title: 'Ha Long Bay',
            username: '@nature_explorer',
            description: 'A popular travel destination in Quang Ninh Province, Vietnam. Features thousands of limestone karsts and isles in various shapes. This destination attracts millions of visitors every year who come to take boat cruises and explore the majestic caves.',
        },
        {
            id: '3',
            status: 'active',
            label: { text: 'Verified Place', color: '#14532d', bgColor: '#bbf7d0' },
            imageUrl: 'https://images.unsplash.com/photo-1581337204873-ef36aa186caa?q=80&w=600&auto=format&fit=crop',
            title: 'Nha Trang City',
            username: '@nature_explorer',
            description: 'Known for its stunning beaches, diving sites and offshore islands. Nha Trang’s main beach is a long, curving stretch along Tran Phu Street backed by a promenade, hotels and seafood restaurants.',
        },
        // --- CÁC ĐỊA ĐIỂM CHỜ DUYỆT (PENDING) ---
        {
            id: '4',
            status: 'pending',
            label: { text: 'Pending Approval', color: '#713f12', bgColor: '#fef08a' },
            imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
            title: 'The Azure Retreat',
            username: '@retreat_official',
            description: 'New destination submission. Detailed amenities include infinity pool, private beach access, and organic farm-to-table dining. Requires verification of business license and environmental safety checks before it can be listed publicly on our platform.',
        },
        {
            id: '5',
            status: 'pending',
            label: { text: 'Pending Approval', color: '#713f12', bgColor: '#fef08a' },
            imageUrl: 'https://images.unsplash.com/photo-1596796338561-bd80e64f895c?q=80&w=600&auto=format&fit=crop',
            title: 'Mu Cang Chai Terraces',
            username: '@wander_lust',
            description: 'Breathtaking rice terraces carved into the mountains. Best time to visit is during the harvest season in September and October.',
        },
    ];

    const tabs = ['Active Places', 'Pending Approval'];

    const [activeTab, setActiveTab] = useState<string>('Active Places');
    const [activeNavItem, setActiveNavItem] = useState('Content');
    const navItems = ['Users', 'Content', 'Alerts', 'Profile'];

    const [expandedDescIds, setExpandedDescIds] = useState<string[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const toggleDescription = (id: string) => {
        if (expandedDescIds.includes(id)) {
            setExpandedDescIds(expandedDescIds.filter(itemId => itemId !== id));
        } else {
            setExpandedDescIds([...expandedDescIds, id]);
        }
    };

    const displayedItems = mockContentItems.filter((item) => {
        if (activeTab === 'Active Places') return item.status === 'active';
        if (activeTab === 'Pending Approval') return item.status === 'pending';
        return true;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    </View>
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

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {displayedItems.map((item) => {
                            const isExpanded = expandedDescIds.includes(item.id);

                            return (
                                <View key={item.id} style={styles.card}>
                                    <TouchableOpacity
                                        style={styles.imageContainer}
                                        activeOpacity={0.9}
                                        onPress={() => setPreviewImage(item.imageUrl)}
                                    >
                                        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                                        <View style={[styles.cardLabel, { backgroundColor: item.label.bgColor }]}>
                                            <Text style={[styles.cardLabelText, { color: item.label.color }]}>
                                                {item.label.text}
                                            </Text>
                                        </View>
                                        <View style={styles.zoomIconContainer}>
                                            <Text style={styles.zoomIcon}>🔍</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <View style={styles.userRow}>
                                        <View style={styles.userAvatarMock} />
                                        <Text style={styles.userName}>{item.username}</Text>
                                    </View>

                                    <Text
                                        style={styles.cardDesc}
                                        numberOfLines={isExpanded ? undefined : 3}
                                    >
                                        “{item.description}”
                                    </Text>

                                    <TouchableOpacity onPress={() => toggleDescription(item.id)}>
                                        <Text style={styles.readMoreBtn}>
                                            {isExpanded ? 'Show less' : 'Read more'}
                                        </Text>
                                    </TouchableOpacity>

                                    <View style={styles.actionRow}>
                                        {item.status === 'active' ? (
                                            <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]}>
                                                <Text style={styles.navIconMock}>🗑️ </Text>
                                                <Text style={styles.btnDeleteText}>Delete Place</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <>
                                                <TouchableOpacity style={[styles.actionBtn, styles.btnApprove]}>
                                                    <Text style={styles.btnApproveText}>Approve</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.actionBtn, styles.btnReject]}>
                                                    <Text style={styles.btnRejectText}>Reject</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            );
                        })}

                        {displayedItems.length === 0 && (
                            <Text style={styles.emptyText}>No destinations found in this category.</Text>
                        )}
                    </ScrollView>
                </View>
            </View>

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
        </SafeAreaView>
    );
};

