import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletRow}>
        <Text style={styles.bulletMark}>-</Text>
        <Text style={styles.bulletText}>{children}</Text>
    </View>
);

export default function PrivacyPolicyScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chính sách Quyền riêng tư</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.lastUpdated}>Cập nhật lần cuối: Tháng 6 năm 2026</Text>

                <Text style={styles.paragraph}>
                    Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Chính sách Quyền riêng tư này giải thích thông tin chúng tôi thu thập, cách sử dụng và bảo vệ dữ liệu của bạn khi sử dụng ứng dụng Travel App.
                </Text>

                <Section title="1. Thông tin chúng tôi thu thập">
                    <Text style={styles.paragraph}>
                        Chúng tôi thu thập thông tin giúp cung cấp trải nghiệm du lịch tốt hơn và cá nhân hóa hơn.
                    </Text>
                    <Bullet>
                        <Text style={styles.bold}>Thông tin cá nhân:</Text> tên,
                        địa chỉ email, avatar, tên người dùng và thông tin tài khoản bạn cung cấp.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Hoạt động du lịch:</Text> địa điểm đã lưu,
                        kế hoạch chuyến đi, đánh giá, xếp hạng và địa điểm bạn thêm vào ứng dụng.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Thông tin thiết bị:</Text> dữ liệu sử dụng ứng dụng cơ bản được sử dụng để giữ dịch vụ ổn định và an toàn.
                    </Bullet>
                </Section>

                <Section title="2. Cách chúng tôi sử dụng thông tin">
                    <Bullet>Tạo và quản lý tài khoản của bạn.</Bullet>
                    <Bullet>Lưu chuyến đi, địa điểm yêu thích và sở thích du lịch của bạn.</Bullet>
                    <Bullet>Cải thiện tính năng, hiệu suất và trải nghiệm người dùng của ứng dụng.</Bullet>
                    <Bullet>Gửi các cập nhật quan trọng về tài khoản, bảo mật hoặc dịch vụ.</Bullet>
                    <Bullet>Hỗ trợ xử lý giao dịch đặt phòng qua đối tác.</Bullet>
                    <Bullet>Phân tích xu hướng để cải thiện dịch vụ.</Bullet>
                </Section>

                <Section title="3. Chia sẻ thông tin">
                    <Text style={styles.paragraph}>
                        Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi có thể chia sẻ thông tin có hạn khi cần thiết để vận hành ứng dụng, tuân thủ yêu cầu pháp lý, hoặc bảo vệ người dùng và dịch vụ của chúng tôi.
                    </Text>
                    <Bullet>
                        <Text style={styles.bold}>Đối tác dịch vụ:</Text> Các bên cung cấp dịch vụ đặt phòng, thanh toán và vận hành ứng dụng.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Yêu cầu pháp lý:</Text> Khi luật pháp yêu cầu hoặc để bảo vệ quyền lợi của chúng tôi.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Quyền sở hữu:</Text> Trong trường hợp sáp nhập hoặc bán một phần hoặc toàn bộ tài sản.
                    </Bullet>
                </Section>

                <Section title="4. Lưu trữ và bảo mật dữ liệu">
                    <Text style={styles.paragraph}>
                        Chúng tôi sử dụng các biện pháp kỹ thuật và tổ chức hợp lý để bảo vệ thông tin của bạn. Dữ liệu được lưu trữ trên các máy chủ bảo vệ và được mã hóa khi truyền tải. Tuy nhiên, không có dịch vụ kỹ thuật số nào có thể đảm bảo bảo mật hoàn toàn, vì vậy vui lòng giữ thông tin đăng nhập của bạn riêng tư.
                    </Text>
                    <Text style={styles.paragraph}>
                        Chúng tôi lưu trữ dữ liệu của bạn trong thời gian cần thiết để cung cấp dịch vụ và tuân thủ nghĩa vụ pháp lý. Khi tài khoản bị xóa, chúng tôi sẽ xóa hoặc hủy danh danh dữ liệu cá nhân của bạn trong vòng 30 ngày.
                    </Text>
                </Section>

                <Section title="5. Quyền của bạn">
                    <Bullet>Bạn có thể cập nhật thông tin hồ sơ trong tài khoản của mình.</Bullet>
                    <Bullet>Bạn có thể quản lý tùy chọn thông báo từ màn hình Hồ sơ.</Bullet>
                    <Bullet>Bạn có thể yêu cầu xem xét hoặc xóa dữ liệu của mình bằng cách liên hệ với chúng tôi.</Bullet>
                    <Bullet>Bạn có quyền rút đồng ý cho việc thu thập dữ liệu bất kỳ lúc nào.</Bullet>
                    <Bullet>Bạn có quyền yêu cầu sao chép dữ liệu cá nhân của mình.</Bullet>
                </Section>

                <Section title="6. Cookie và công nghệ theo dõi">
                    <Text style={styles.paragraph}>
                        Chúng tôi sử dụng cookie và các công nghệ tương tự để:{'\n'}
                        • Nhớ những gì bạn đang làm khi điều hướng giữa các trang{'\n'}
                        • Hiểu cách người dùng sử dụng ứng dụng để cải thiện dịch vụ{'\n'}
                        • Cung cấp trải nghiệm được cá nhân hóa{'\n'}
                        Bạn có thể quản lý cookie trong cài đặt thiết bị của mình.
                    </Text>
                </Section>

                <Section title="7. Thay đổi chính sách">
                    <Text style={styles.paragraph}>
                        Chúng tôi có thể cập nhật chính sách này theo thời gian. Thay đổi sẽ được thông báo qua ứng dụng. Việc bạn tiếp tục sử dụng ứng dụng sau khi thay đổi có hiệu lực thể hiện sự chấp nhận của bạn.
                    </Text>
                </Section>

                <Section title="8. Liên hệ">
                    <Text style={styles.paragraph}>
                        Nếu bạn có bất kỳ câu hỏi nào về Chính sách Quyền riêng tư này, vui lòng liên hệ với chúng tôi qua:{'\n'}
                        Email: travelapp.support@gmail.com{'\n'}
                        Chúng tôi sẽ cố gắng phản hồi trong vòng 2-3 ngày làm việc.
                    </Text>
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 12,
        minWidth: 72,
    },
    backText: {
        fontSize: 16,
        color: '#177bb3',
        fontWeight: '700',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    placeholder: {
        width: 72,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    section: {
        marginTop: 22,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#177bb3',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    bulletMark: {
        width: 16,
        fontSize: 15,
        lineHeight: 24,
        color: '#177bb3',
        fontWeight: '800',
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    bold: {
        fontWeight: '700',
        color: '#1e293b',
    },
});
