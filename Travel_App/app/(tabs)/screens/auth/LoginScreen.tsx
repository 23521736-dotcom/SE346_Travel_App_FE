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
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useTranslation } from 'react-i18next';
import { oauthLogin } from '../../../../lib/api/auth';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import styles from './LoginScreen.styles';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: 'travelapp',
    path: 'oauth-google-callback',
});

export default function LoginScreen({ navigation }: any) {
    const { t } = useTranslation();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [oauthSubmitting, setOauthSubmitting] = useState(false);
    const { login } = useAuth();

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword_email', { email: email.trim() });
    };

    const handleGoogleOAuth = async () => {
        if (!GOOGLE_CLIENT_ID) {
            Alert.alert(t('auth.configError'), t('auth.googleNotConfigured'));
            return;
        }

        setOauthSubmitting(true);
        try {
            // Construct Google OAuth URL for implicit flow
            const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
            authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
            authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
            authUrl.searchParams.set('response_type', 'id_token');
            authUrl.searchParams.set('scope', 'openid email profile');
            authUrl.searchParams.set('nonce', Math.random().toString(36).substring(7));

            const authResult = await WebBrowser.openAuthSessionAsync(
                authUrl.toString(),
                GOOGLE_REDIRECT_URI,
            );

            if (authResult.type === 'success') {
                const redirectUrl = new URL(authResult.url);
                const idToken = redirectUrl.searchParams.get('id_token');

                if (!idToken) {
                    throw new Error('No ID token received from Google');
                }

                // Call backend API with the ID token
                const authResponse = await oauthLogin('google', idToken);

                Alert.alert(
                    t('auth.loginSuccess'),
                    authResponse.isNewUser
                        ? t('auth.newAccountCreated')
                        : t('auth.welcomeBackMessage')
                );
            } else if (authResult.type === 'cancel') {
                // User cancelled - do nothing
            } else {
                throw new Error('OAuth failed');
            }
        } catch (err: any) {
            console.error('Google OAuth error:', err);
            const msg = getApiErrorMessage(err);
            Alert.alert(
                t('auth.loginFailed'),
                msg.includes('NOT_CONFIGURED') || msg.includes('OAUTH')
                    ? t('auth.googleOAuthNotConfigured')
                    : msg || t('auth.errorOccurred')
            );
        } finally {
            setOauthSubmitting(false);
        }
    };

    const handleAppleOAuth = async () => {
        Alert.alert(t('auth.appleNotSupported'), t('auth.appleSignInNotSupported'));
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        if (provider === 'google') {
            await handleGoogleOAuth();
        } else {
            await handleAppleOAuth();
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert(t('common.error'), t('auth.enterEmailPassword'));
            return;
        }
        setSubmitting(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text =
                msg === 'INVALID_CREDENTIALS'
                    ? t('auth.invalidCredentials')
                    : msg;
            Alert.alert(t('auth.loginFailed'), text);
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
                        {/* --- Ô NHẬP EMAIL --- */}
                        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                            <Image
                                source={require('../../../../assets/images/email-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
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

                        {/* --- Ô NHẬP PASSWORD --- */}
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/password-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
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
                                    style={{ width: 20, height: 20, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                                />
                            </TouchableOpacity>
                        </View>

                        {/* --- QUÊN MẬT KHẨU --- */}
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
                        <View style={styles.lineContainer}>
                            <View style={styles.line} />
                            <Text style={styles.text}>{t('auth.orContinueWith')}</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={[styles.containerGG_Apple, { marginTop: 20 }]}>
                            <Pressable
                                style={styles.buttonGG_Apple}
                                onPress={() => handleOAuth('google')}
                                disabled={oauthSubmitting}
                                accessibilityLabel="Sign in with Google"
                                accessibilityRole="button">
                                <View style={styles.containerImageGG_Apple}>
                                    {oauthSubmitting ? (
                                        <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                                    ) : (
                                        <Image source={require('../../../../assets/images/google-icon.png')} style={{ width: 20, height: 20 }} />
                                    )}
                                    <Text style={styles.buttonGG_AppleText}>
                                        {oauthSubmitting ? t('auth.loggingIn') : 'Google'}
                                    </Text>
                                </View>
                            </Pressable>

                            <Pressable
                                style={styles.buttonGG_Apple}
                                onPress={() => handleOAuth('apple')}
                                accessibilityLabel="Sign in with Apple"
                                accessibilityRole="button">
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../../assets/images/apple-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Apple</Text>
                                </View>
                            </Pressable>
                        </View>

                        <Text style={[styles.text, { marginTop: 40, color: '#ccc2c2', marginBottom: 40 }]}>
                            {t('auth.noAccount')}{' '}
                            <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>
                                {t('auth.register')}
                            </Text>
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}
