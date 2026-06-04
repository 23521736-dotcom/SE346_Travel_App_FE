import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import { COLORS, styles } from './ForgotPasswordScreen_email.style';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen_email({ navigation, route }: any) {
    const [email, setEmail] = useState<string>(route?.params?.email ?? '');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSendCode = async () => {
        if (!email.trim()) {
            const msg = 'Vui lòng nhập email';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Lỗi', msg);
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email.trim());
            const successMsg = 'Mã OTP đã được gửi đến email của bạn.';
            if (Platform.OS === 'web') {
                window.alert(successMsg);
                navigation.navigate('ForgotPassword_OTP', { email: email.trim() });
            } else {
                Alert.alert('Thành công', successMsg, [
                    { text: 'OK', onPress: () => navigation.navigate('ForgotPassword_OTP', { email: email.trim() }) }
                ]);
            }
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ImageBackground
                    source={{ uri: "https://i.pinimg.com/736x/77/b4/21/77b421686d6088e6527cf57d68c69e96.jpg" }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Feather name="arrow-left" size={24} color={COLORS.cyan} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Reset Password</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.card}>

                            {/* Cụm Icon Logo ở giữa */}
                            <View style={styles.iconContainer}>
                                <View style={styles.iconBackground}>
                                    <Feather name="rotate-ccw" size={34} color={COLORS.cyan} />
                                    <View style={styles.lockAbsolute}>
                                        <Ionicons name="lock-closed" size={16} color={COLORS.cyan} />
                                    </View>
                                </View>
                            </View>

                            {/* Tiêu đề & Mô tả */}
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Enter your email address and we'll send you a code to reset your password.
                            </Text>

                            {/* Form nhập liệu */}
                            <View style={styles.formContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="yourname@example.com"
                                        placeholderTextColor={COLORS.placeholderText}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    activeOpacity={0.8}
                                    onPress={handleSendCode}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#0a1a24" />
                                    ) : (
                                        <>
                                            <Text style={styles.submitText}>Send Code</Text>
                                            <Feather name="arrow-right" size={22} color="#0a1a24" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Footer Link */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Remember your password? </Text>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.loginText}>Log In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};



