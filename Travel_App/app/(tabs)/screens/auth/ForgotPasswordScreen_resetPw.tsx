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
    View
} from 'react-native';
import { COLORS, styles } from './ForgotPasswordScreen_resetPw.style';

export default function ForgotPasswordScreen_resetPw({ navigation }: any) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleResetPassword = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: "https://i.pinimg.com/736x/77/b4/21/77b421686d6088e6527cf57d68c69e96.jpg" }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                {/* Header phía trên Card */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color={COLORS.cyan} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Back</Text>
                </View>

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    enabled={Platform.OS === 'ios'}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.card}>

                            {/* Icon Máy bay (Airplane) phía trên */}
                            <View style={styles.iconContainer}>
                                <View style={styles.iconBackground}>
                                    <Ionicons name="airplane" size={34} color="#ffffff" />
                                </View>
                            </View>

                            <Text
                                style={styles.title}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                Create New Password
                            </Text>
                            <Text style={styles.subtitle}>
                                Your new password must be different from previous used passwords.
                            </Text>

                            {/* Form Inputs */}
                            <View style={styles.formContainer}>

                                {/* New Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>NEW PASSWORD</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor={COLORS.placeholderText}
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={22}
                                                color={COLORS.mutedText}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirm Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor={COLORS.placeholderText}
                                            secureTextEntry={!showConfirmPassword}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                                size={22}
                                                color={COLORS.mutedText}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Nút Reset Password */}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    activeOpacity={0.8}
                                    onPress={handleResetPassword}
                                >
                                    <Text style={styles.submitText}>Reset Password</Text>
                                    <Feather name="refresh-cw" size={20} color="#0a1a24" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.footerLink}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.footerLinkText}>Back to Sign In</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

