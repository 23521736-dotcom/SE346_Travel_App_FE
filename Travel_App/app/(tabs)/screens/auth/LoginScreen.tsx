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
    View
} from 'react-native';
import { oauthLogin } from '../../../../lib/api/auth';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword_email', { email: email.trim() });
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        try {
            await oauthLogin(provider);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            Alert.alert(
                'Chua ho tro',
                msg.includes('NOT_CONFIGURED')
                    ? `Dang nhap ${provider} chua duoc cau hinh tren server`
                    : msg
            );
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Loi', 'Vui long nhap email va mat khau');
            return;
        }
        setSubmitting(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text =
                msg === 'INVALID_CREDENTIALS'
                    ? 'Email hoac mat khau khong dung'
                    : msg;
            Alert.alert('Dang nhap that bai', text);
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
                            <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>
                                Register
                            </Text>
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}
