import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { oauthLogin } from '../../../../lib/api/auth';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }: any) {
    const nav = navigation ?? useNavigation<any>();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const handleForgotPassword = () => {
        nav.navigate('ForgotPassword_email', { email: email.trim() });
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        try {
            await oauthLogin(provider);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text = msg.includes('NOT_CONFIGURED')
                ? `Dang nhap ${provider} chua duoc cau hinh tren server`
                : msg;

            if (Platform.OS === 'web') window.alert(text);
            else Alert.alert('Chua ho tro', text);
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            const msg = 'Vui lòng nhập email và mật khẩu';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Lỗi', msg);
            return;
        }
        setSubmitting(true);
        try {
            console.log('Attempting login for:', email.trim());
            await login(email.trim(), password);
            console.log('Login successful');

            if (Platform.OS === 'web') {
                // Hard reload to ensure navigation state is clean and RootNavigation picks up the user
                console.log('Web environment detected, performing reload for navigation sync');
                window.location.reload();
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = getApiErrorMessage(err);
            let text = msg;

            if (msg === 'INVALID_CREDENTIALS') {
                text = 'Email hoặc mật khẩu không đúng';
            } else if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('activated')) {
                text = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác nhận.';
            }

            if (Platform.OS === 'web') window.alert(text);
            else Alert.alert('Đăng nhập thất bại', text);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/77/b4/21/77b421686d6088e6527cf57d68c69e96.jpg" }}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', marginTop: 40 }}>

                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Image
                            source={{ uri: "https://cdn-icons-png.flaticon.com/128/201/201623.png" }}
                            style={{ height: 70, width: 70, marginBottom: 5 }}
                        />
                        <Text style={{ fontWeight: '800', fontSize: 32, textAlign: 'center', color: '#ffffff' }}>
                            Welcome Back
                        </Text>
                        <Text style={{ marginTop: 6, textAlign: 'center', color: '#9ca3af', fontSize: 16 }}>
                            Log in to continue your adventure
                        </Text>
                    </View>

                    <View style={styles.container}>
                        {/* --- Ô NHẬP EMAIL --- */}
                        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                            <Image
                                source={require('../../../../assets/images/email-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                            />
                            <TextInput
                                placeholder="Email Address"
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                placeholderTextColor="#94a3b8" // Đồng bộ màu chữ mờ với icon
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* --- Ô NHẬP PASSWORD --- */}
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/password-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                            />

                            <TextInput
                                placeholder="Password"
                                secureTextEntry={!isPasswordVisible}
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                placeholderTextColor="#94a3b8" // Đồng bộ màu chữ mờ với icon
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!isPasswordVisible)}
                                style={{ paddingLeft: 10 }}
                            >
                                <Image
                                    source={isPasswordVisible
                                        ? require('../../../../assets/images/hidden_eyepassword-icon.png')
                                        : require('../../../../assets/images/eyepassword-icon.png')}
                                    style={{ width: 20, height: 20, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                                />
                            </TouchableOpacity>
                        </View>

                        {/* --- QUÊN MẬT KHẨU --- */}
                        <View style={{ alignItems: 'flex-end', paddingTop: 12 }}>
                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.linkText}>Forgot Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.containerChild, { marginTop: 20, alignItems: 'center' }]}>
                        <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Log in</Text>
                            )}
                        </Pressable>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={styles.lineContainer}>
                            <View style={styles.line} />
                            <Text style={styles.text}>Or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={[styles.containerGG_Apple, { marginTop: 20 }]}>
                            <Pressable style={styles.buttonGG_Apple} onPress={() => handleOAuth('google')}>
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../../assets/images/google-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Google</Text>
                                </View>
                            </Pressable>

                            <Pressable style={styles.buttonGG_Apple} onPress={() => handleOAuth('apple')}>
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../../assets/images/apple-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Apple</Text>
                                </View>
                            </Pressable>
                        </View>

                        <Text style={[styles.text, { marginTop: 40, color: '#ccc2c2', marginBottom: 40 }]}>
                            Don't have an account?{' '}
                            <Text style={styles.linkText} onPress={() => nav.navigate("Register")}>
                                Register
                            </Text>
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}
