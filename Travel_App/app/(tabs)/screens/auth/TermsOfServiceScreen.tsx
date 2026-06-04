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

export default function TermsOfServiceScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Điều khoản Dịch vụ</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.lastUpdated}>Cập nhật lần cuối: Tháng 6 năm 2026</Text>

                <Text style={styles.paragraph}>
                    Chào mừng bạn đến với Travel App. Bằng cách tải xuống, truy cập hoặc sử dụng ứng dụng, bạn đồng ý bị ràng buộc bởi những Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng ứng dụng.
                </Text>

                <Text style={styles.sectionTitle}>1. Chấp nhận điều khoản</Text>
                <Text style={styles.paragraph}>
                    Bằng cách tạo tài khoản hoặc sử dụng dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản này, cũng như Chính sách Quyền riêng tư của chúng tôi.
                </Text>

                <Text style={styles.sectionTitle}>2. Mô tả dịch vụ</Text>
                <Text style={styles.paragraph}>
                    Travel App là một ứng dụng du lịch cho phép người dùng:{'\n'}
                    • Lên kế hoạch và tổ chức các chuyến đi cá nhân hoặc nhóm{'\n'}
                    • Tìm kiếm và lưu trữ các địa điểm du lịch yêu thích{'\n'}
                    • Chia sẻ trải nghiệm du lịch với bạn bè và người thân{'\n'}
                    • Quản lý lịch trình và đặt phòng qua các đối tác của chúng tôi{'\n'}
                    • Đánh giá và nhận xét về các địa điểm đã đến thăm
                </Text>

                <Text style={styles.sectionTitle}>3. Tài khoản người dùng</Text>
                <Text style={styles.paragraph}>
                    • Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình.{'\n'}
                    • Bạn đồng ý cung cấp thông tin chính xác khi đăng ký và cập nhật nếu có thay đổi.{'\n'}
                    • Bạn phải thông báo ngay cho chúng tôi nếu nghi ngờ có bất kỳ truy cập trái phép nào vào tài khoản của bạn.{'\n'}
                    • Mỗi người dùng được phép tạo một tài khoản cá nhân. Việc tạo nhiều tài khoản có thể dẫn đến khóa tất cả các tài khoản liên quan.
                </Text>

                <Text style={styles.sectionTitle}>4. Quy tắc sử dụng</Text>
                <Text style={styles.paragraph}>
                    Khi sử dụng ứng dụng, bạn đồng ý KHÔNG:{'\n'}
                    • Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc trái phép.{'\n'}
                    • Cố gắng can thiệp, làm gián đoạn hoặc truy cập trái phép vào máy chủ hoặc mạng của chúng tôi.{'\n'}
                    • Sao chép, sửa đổi hoặc phân phối tài liệu có bản quyền của chúng tôi mà không có phép.{'\n'}
                    • Đăng tải nội dung lừa đảo, vi phạm, đe dọa hoặc xúc phạm người dùng khác.{'\n'}
                    • Sử dụng ứng dụng để thu thập dữ liệu về người dùng khác mà không có sự đồng ý.
                </Text>

                <Text style={styles.sectionTitle}>5. Nội dung do người dùng tạo</Text>
                <Text style={styles.paragraph}>
                    • Bạn giữ quyền sở hữu đối với nội dung bạn đăng tải trên ứng dụng.{'\n'}
                    • Bằng cách đăng tải nội dung, bạn cấp cho chúng tôi quyền sử dụng, hiển thị và phân phối nội dung đó để cung cấp dịch vụ.{'\n'}
                    • Bạn cam kết rằng bạn có quyền đăng tải nội dung đó và nó không vi phạm quyền của bên thứ ba.{'\n'}
                    • Chúng tôi bảo lưu quyền xóa bất kỳ nội dung nào vi phạm điều khoản này.
                </Text>

                <Text style={styles.sectionTitle}>6. Quyền sở hữu trí tuệ</Text>
                <Text style={styles.paragraph}>
                    Ứng dụng, thiết kế, logo và tất cả nội dung có trong ứng dụng thuộc sở hữu của Travel App và được bảo vệ bởi luật bản quyền quốc tế. Bạn không được sử dụng bất kỳ thương hiệu, logo hoặc nội dung nào của chúng tôi mà không có sự cho phép bằng văn bản.
                </Text>

                <Text style={styles.sectionTitle}>7. Giới hạn trách nhiệm</Text>
                <Text style={styles.paragraph}>
                    Ứng dụng được cung cấp trên cơ sở &ldquo;nguyên trạng&rdquo; và &ldquo;có sẵn&rdquo;. Chúng tôi không bảo đảm rằng ứng dụng sẽ không bị gián đoạn, không có lỗi hoặc hoàn toàn an toàn. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng, bao gồm nhưng không giới hạn thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả.
                </Text>

                <Text style={styles.sectionTitle}>8. Thay đổi điều khoản</Text>
                <Text style={styles.paragraph}>
                    Chúng tôi bảo lưu quyền sửa đổi hoặc cập nhật các điều khoản này bất kỳ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức khi được đăng tải. Việc bạn tiếp tục sử dụng ứng dụng thể hiện sự chấp nhận các điều khoản đã sửa đổi.
                </Text>

                <Text style={styles.sectionTitle}>9. Liên hệ</Text>
                <Text style={styles.paragraph}>
                    Nếu bạn có bất kỳ câu hỏi hoặc lo ngại nào về Điều khoản Dịch vụ này, vui lòng liên hệ với chúng tôi qua:{'\n'}
                    Email: travelapp.support@gmail.com{'\n'}
                    Chúng tôi sẽ cố gắng phản hồi trong vòng 2-3 ngày làm việc.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backText: {
        fontSize: 16,
        color: '#177bb3',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
    },
    placeholder: {
        width: 50,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 50,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
});
