import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import { COLORS, styles } from './ForgotPasswordScreen_OTP.style';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen_OTP({ navigation, route }: any) {
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();
    const inputRef = useRef<TextInput>(null);
    const email = route?.params?.email ?? 'user@example.com';

    // Xử lý khi bấm vào khu vực nhập OTP để mở bàn phím
    const handlePressOTP = () => {
        inputRef.current?.focus();
    };

    const handleVerify = () => {
        if (code.length < 6) {
            const msg = 'Vui lòng nhập đầy đủ mã OTP 6 số';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Lỗi', msg);
            return;
        }
        navigation.navigate('ForgotPassword_resetPw', { email, code });
    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            await forgotPassword(email);
            const msg = 'Mã OTP mới đã được gửi.';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Thành công', msg);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            if (Platform.OS === 'web') window.alert(`Lỗi: ${msg}`);
            else Alert.alert('Lỗi', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />

            <ImageBackground
                source={{ uri: "https://i.pinimg.com/736x/77/b4/21/77b421686d6088e6527cf57d68c69e96.jpg" }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Lớp phủ tối */}
                <View style={styles.overlay} />

                {/* Header phía ngoài thẻ Card */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color={COLORS.cyan} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Back</Text>
                </View>

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.contentContainer}>
                        {/* Khung Card chính */}
                        <View style={styles.card}>

                            {/* Icon Email giữa màn hình */}
                            <View style={styles.iconContainer}>
                                <View style={styles.iconBackground}>
                                    <MaterialCommunityIcons name="email" size={32} color="#ffffff" />
                                    <View style={styles.lockAbsolute}>
                                        <Ionicons name="lock-closed" size={14} color="#0a1a24" />
                                    </View>
                                </View>
                            </View>

                            {/* Tiêu đề & Mô tả */}
                            <Text style={styles.title}>Verify Email</Text>
                            <Text style={styles.subtitle}>
                                Please enter the 6-digit code sent to your email address{' '}
                                <Text style={styles.emailHighlight}>{email}</Text>
                            </Text>

                            {/* Khu vực nhập mã OTP (Hiển thị 6 ô) */}
                            <Pressable style={styles.otpContainer} onPress={handlePressOTP}>
                                {[0, 1, 2, 3, 4, 5].map((index) => {
                                    const digit = code[index] || '';
                                    const isCurrentFocus = index === code.length; // Highlight ô sắp nhập

                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.otpBox,
                                                isCurrentFocus && styles.otpBoxActive,
                                                digit !== '' && styles.otpBoxFilled
                                            ]}
                                        >
                                            <Text style={styles.otpText}>{digit}</Text>
                                        </View>
                                    );
                                })}
                            </Pressable>

                            {/* TextInput ẩn để hứng bàn phím */}
                            <TextInput
                                ref={inputRef}
                                value={code}
                                onChangeText={setCode}
                                maxLength={6}
                                keyboardType="number-pad"
                                style={styles.hiddenInput}
                                autoFocus={true} // Tự động mở bàn phím khi vào màn hình
                            />

                            {/* Nút Verify */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                activeOpacity={0.8}
                                onPress={handleVerify}
                            >
                                <Text style={styles.submitText}>Verify</Text>
                                <Feather name="arrow-right" size={20} color="#0a1a24" />
                            </TouchableOpacity>

                            {/* Footer Link */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Didn&apos;t receive the code? </Text>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleResendCode}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={COLORS.cyan} />
                                    ) : (
                                        <Text style={styles.resendText}>Resend Code</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                        </View >
                    </View >
                </KeyboardAvoidingView >
            </ImageBackground >
        </SafeAreaView >
    );
};

