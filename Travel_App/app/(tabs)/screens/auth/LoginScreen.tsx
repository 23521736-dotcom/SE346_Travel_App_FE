import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }: any) {
    const fallbackNavigation = useNavigation<any>();
    const nav = navigation ?? fallbackNavigation;
    const { t } = useTranslation();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(message);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleForgotPassword = () => {
        nav.navigate('ForgotPassword_email', { email: email.trim() });
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            showAlert(t('common.error'), t('auth.enterEmailPassword'));
            return;
        }

        setSubmitting(true);
        try {
            console.log('Attempting login for:', email.trim());
            await login(email.trim(), password);
            console.log('Login successful');

            if (Platform.OS === 'web') {
                window.location.reload();
            }
        } catch (err: any) {
            console.error('Login error:', err);
            console.log("message:", err.message);
            console.log("response:", err.response?.data);
            console.log("request:", err.request);
            const msg = getApiErrorMessage(err);
            let text = msg === 'INVALID_CREDENTIALS' ? t('auth.invalidCredentials') : msg;

            if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('activated')) {
                text = 'Account is not activated. Please check your email to verify it.';
            }
            showAlert(t('auth.loginFailed'), text);
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
                            {t('auth.welcomeBack')}
                        </Text>
                        <Text style={{ marginTop: 6, textAlign: 'center', color: '#9ca3af', fontSize: 16 }}>
                            {t('auth.loginToContinue')}
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                            <Image
                                source={require('../../../../assets/images/email-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }}
                            />
                            <TextInput
                                placeholder={t('auth.emailPlaceholder')}
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                accessibilityLabel="Email address"
                                accessibilityHint="Enter your email address to log in"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/password-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }}
                            />

                            <TextInput
                                placeholder={t('auth.passwordPlaceholder')}
                                secureTextEntry={!isPasswordVisible}
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                accessibilityLabel="Password"
                                accessibilityHint="Enter your password to log in"
                            />

                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!isPasswordVisible)}
                                style={{ paddingLeft: 10 }}
                                accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
                                accessibilityRole="button"
                                accessibilityHint={isPasswordVisible ? "Tap to hide password" : "Tap to show password"}
                            >
                                <Image
                                    source={isPasswordVisible
                                        ? require('../../../../assets/images/hidden_eyepassword-icon.png')
                                        : require('../../../../assets/images/eyepassword-icon.png')}
                                    style={{ width: 20, height: 20, tintColor: '#94a3b8' }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'flex-end', paddingTop: 12 }}>
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                accessibilityLabel="Forgot password"
                                accessibilityRole="link"
                                accessibilityHint="Tap to reset your password">
                                <Text style={styles.linkText}>{t('auth.forgotPassword')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.containerChild, { marginTop: 20, alignItems: 'center' }]}>
                        <Pressable
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={submitting}
                            accessibilityLabel="Log in"
                            accessibilityRole="button"
                            accessibilityHint="Tap to sign in to your account">
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>{t('auth.login')}</Text>
                            )}
                        </Pressable>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <Text style={[styles.text, { color: '#ccc2c2', marginBottom: 40 }]}>
                            {t('auth.noAccount')}{' '}
                            <Text style={styles.linkText} onPress={() => nav.navigate("Register")}>
                                {t('auth.register')}
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
