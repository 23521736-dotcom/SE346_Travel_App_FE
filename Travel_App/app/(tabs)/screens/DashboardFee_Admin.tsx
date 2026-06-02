import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import file style
import { styles } from './DashboardFee_Admin.style';
import DashboardPlace_Admin from './DashboardPlace_Admin';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Transaction {
    id: string;
    ownerName: string;
    amount: string;
    avatarBg: string;
    avatarColor: string;
    status: 'Paid' | 'Unpaid';
}

const DashboardFee_Admin: React.FC = (navigation) => {
    // --- DỮ LIỆU MẪU ---
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', ownerName: 'Blue Lagoon Resort', amount: '$2,450.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
        { id: '2', ownerName: 'Gion District Stay', amount: '$1,200.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '3', ownerName: 'Alpine Lodge & Spa', amount: '$840.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '4', ownerName: 'Safari Oasis Villa', amount: '$3,100.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
        { id: '5', ownerName: 'Crystal Bay', amount: '$4,100.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '6', ownerName: 'Highland Retreat', amount: '$950.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '7', ownerName: 'Valley View', amount: '$1,800.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '8', ownerName: 'Oceanfront Inn', amount: '$2,900.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Unpaid' },
        { id: '9', ownerName: 'Pine Cabin', amount: '$600.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
        { id: '10', ownerName: 'Eco Lodge', amount: '$1,150.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
        { id: '11', ownerName: 'Mountain View', amount: '$3,300.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
        { id: '12', ownerName: 'Riverfront', amount: '$890.00', avatarBg: '#e0f2fe', avatarColor: '#0284c7', status: 'Paid' },
    ]);

    // --- STATE CHO TAB & SHOW ALL ---
    const transactionTabs = ['Unpaid', 'Paid'];
    const [activeTab, setActiveTab] = useState<string>('Unpaid');
    const [showAll, setShowAll] = useState<boolean>(false);

    // Lọc giao dịch theo Tab
    const filteredTransactions = transactions.filter(t => t.status === activeTab);

    // Giới hạn 5 item nếu không bật Show All
    const displayedTransactions = showAll ? filteredTransactions : filteredTransactions.slice(0, 5);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setShowAll(false); // Reset lại trạng thái Show All khi đổi tab
    };

    // --- HÀM XỬ LÝ CHUYỂN ĐỔI TRẠNG THÁI ---
    const toggleTransactionStatus = (transactionId: string) => {
        setTransactions(prevTransactions =>
            prevTransactions.map(transaction =>
                transaction.id === transactionId
                    ? { ...transaction, status: transaction.status === 'Paid' ? 'Unpaid' : 'Paid' }
                    : transaction
            )
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            <View style={styles.container}>
                {/* Top Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    </View>
                </View>

                {/* Main Content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Financial Overview Summary */}
                    <View style={styles.summaryCard}>

                        <Text style={styles.mainTitle}>Total Payouts Summary</Text>

                        <View style={styles.amountBlock}>
                            <Text style={styles.amountLabel}>Total Commissions</Text>
                            <Text style={styles.amountValueBlue}>$12,450.00</Text>
                        </View>

                        <View style={styles.amountBlock}>
                            <Text style={styles.amountLabel}>Pending Payments</Text>
                            <Text style={styles.amountValueBrown}>$3,200.00</Text>
                        </View>
                    </View>

                    {/* Thẻ Commission Settings */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Commission Settings</Text>
                            <TouchableOpacity>
                                <Text style={styles.editLink}>Edit Policy</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingRowLeft}>
                                <View style={[styles.settingIconMock, { backgroundColor: '#e0f2fe' }]}>
                                    <Text style={{ color: '#0284c7', fontWeight: 'bold' }}>%</Text>
                                </View>
                                <Text style={styles.settingLabel}>Platform Fee %</Text>
                            </View>
                            <Text style={styles.settingValueBlue}>10%</Text>
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingRowLeft}>
                                <View style={[styles.settingIconMock, { backgroundColor: '#e0f2fe' }]}>
                                    <Text style={{ color: '#0284c7', fontSize: 14 }}>📍</Text>
                                </View>
                                <Text style={styles.settingLabel}>Create Place Fee</Text>
                            </View>
                            <Text style={styles.settingValueBlue}>$25.00</Text>
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingRowLeft}>
                                <View style={[styles.settingIconMock, { backgroundColor: '#fef3c7' }]}>
                                    <Text style={{ color: '#b45309', fontSize: 14 }}>🎯</Text>
                                </View>
                                <Text style={styles.settingLabel}>Create Promotion Fee</Text>
                            </View>
                            <Text style={[styles.settingValueDark, { textAlign: 'right' }]}>$15.00</Text>
                        </View>
                    </View>

                    {/* Thẻ Recent Transactions List */}
                    <View style={[styles.card, { paddingHorizontal: 0 }]}>
                        <View style={styles.transactionHeader}>
                            <View style={styles.transactionTitleRow}>
                                <Text style={styles.cardTitle}>Recent Transactions List</Text>
                            </View>

                            <View style={styles.smallSearchBox}>
                                <Text style={styles.smallSearchIcon}>🔍</Text>
                                <TextInput
                                    style={styles.smallSearchInput}
                                    placeholder="Search owner..."
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>

                        {/* Tabs Phân loại Paid/Unpaid */}
                        <View style={styles.tabContainer}>
                            {transactionTabs.map((tab) => (
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

                        {/* Table Header */}
                        <View style={styles.tableHead}>
                            <Text style={[styles.tableHeadText, { flex: 1.5 }]}>OWNER NAME</Text>
                            <Text style={[styles.tableHeadText, { flex: 1 }]}>TRANSACTION{'\n'}AMOUNT</Text>
                            <Text style={[styles.tableHeadText, { flex: 0.8, textAlign: 'center' }]}>STATUS</Text>
                        </View>

                        {/* Danh sách giao dịch */}
                        {displayedTransactions.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.tableRow,
                                    (index === displayedTransactions.length - 1 && !showAll && filteredTransactions.length <= 5) && { borderBottomWidth: 0 }
                                ]}
                            >
                                {/* Owner Name Col */}
                                <View style={[styles.colName, { flex: 1.5 }]}>
                                    <Text style={styles.ownerNameText}>{item.ownerName}</Text>
                                </View>

                                {/* Amount Col */}
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={styles.ownerAmountText}>{item.amount}</Text>
                                </View>

                                {/* Status Col */}
                                <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => toggleTransactionStatus(item.id)}
                                        style={[
                                            styles.statusBadge,
                                            item.status === 'Paid' ? styles.statusBadgePaid : styles.statusBadgeUnpaid
                                        ]}
                                    >
                                        <Text style={item.status === 'Paid' ? styles.statusTextPaid : styles.statusTextUnpaid}>
                                            {item.status}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {filteredTransactions.length === 0 && (
                            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} transactions found.</Text>
                        )}

                        {/* Nút Show All / Show Less */}
                        {filteredTransactions.length > 5 && (
                            <TouchableOpacity
                                style={styles.viewAllBtn}
                                onPress={() => setShowAll(!showAll)}
                            >
                                <Text style={styles.viewAllText}>
                                    {showAll ? 'Show Less' : `Show All (${filteredTransactions.length})`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default DashboardFee_Admin;