import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getApiErrorMessage, useAuth } from '../../context/AuthContext';
import styles from './RegisterScreen.styles';

export default function RegisterScreen({ navigation }: any) {
    // Always call useNavigation to satisfy Rules of Hooks
    const fallbackNavigation = useNavigation<any>();
    const nav = navigation ?? fallbackNavigation;
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isCfPasswordVisible, setCfPasswordVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'TRAVELER' | 'OWNER'>('TRAVELER');
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Loi', 'Vui long nhap day du thong tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Loi', 'Mat khau xac nhan khong khop');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Loi', 'Mat khau phai co it nhat 8 ky tu');
      return;
    }

    if (!isChecked) {
      Alert.alert('Loi', 'Vui long dong y dieu khoan su dung');
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password, fullName.trim(), selectedRole);
      nav.replace('Login');
    } catch (err) {
      const msg = getApiErrorMessage(err);
      Alert.alert('Dang ky that bai', msg);
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
                <View style={styles.screenContent}>

                    <View style={styles.headerBlock}>
                        <Image
                            source={{ uri: "https://cdn-icons-png.flaticon.com/128/201/201623.png" }}
                            style={styles.headerIcon}
                        />
                        <Text style={styles.headerTitle}>
                            Start Your Journey
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Create an account to explore the world

                        </Text>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/user-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                            />
                            <TextInput
                                placeholder="Full Name"
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                placeholderTextColor="#94a3b8"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="none"
                                accessibilityLabel="Full name"
                                accessibilityHint="Enter your full name"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/email-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }}
                            />
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="#94a3b8"
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                accessibilityLabel="Email address"
                                accessibilityHint="Enter your email address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../../assets/images/password-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                            />
                            <TextInput
                                placeholder="Password"
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                secureTextEntry={!isPasswordVisible}

                                placeholderTextColor="#94a3b8"
                                keyboardType='default'
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={password}
                                onChangeText={setPassword}
                                accessibilityLabel="Password"
                                accessibilityHint="Enter a password with at least 8 characters"
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!isPasswordVisible)}
                                accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
                                accessibilityRole="button">
                        <Image
                            source={
                                isPasswordVisible
                                    ? require('../../../../assets/images/hidden_eyepassword-icon.png')
                                    : require('../../../../assets/images/eyepassword-icon.png')}
                                    style={{ width: 20, height: 20, tintColor: '#94a3b8' }}
                                    resizeMode="contain" />
                    </TouchableOpacity>

                        </View>
                        <View style={styles.inputContainer}>
                            <Image
                        source={require('../../../../assets/images/cfpassword-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#94a3b8' }} // Chuyển sang xám bạc
                            />
                            <TextInput
                                placeholder="Confirm Password"
                                style={{
                                    flex: 1,
                                    color: '#ffffff',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    letterSpacing: 0.5
                                }}
                                secureTextEntry={!isCfPasswordVisible}
                                placeholderTextColor="#94a3b8"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                accessibilityLabel="Confirm password"
                                accessibilityHint="Re-enter your password to confirm"
                            />
                            <TouchableOpacity
                                onPress={() => setCfPasswordVisible(!isCfPasswordVisible)}
                                accessibilityLabel={isCfPasswordVisible ? "Hide confirm password" : "Show confirm password"}
                                accessibilityRole="button">
                                <Image
                                    source={
                                        isCfPasswordVisible
                                            ? require('../../../../assets/images/hidden_eyepassword-icon.png')
                                            : require('../../../../assets/images/eyepassword-icon.png')}
                                    style={{ width: 20, height: 20, tintColor: '#94a3b8' }}
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.roleSection}>
                            <Text style={styles.roleTitle}>Account Type</Text>
                            <View style={styles.roleOptions}>
                                <Pressable
                                    style={[
                                        styles.roleCard,
                                        selectedRole === 'TRAVELER' && styles.roleCardActive,
                                    ]}
                                    onPress={() => setSelectedRole('TRAVELER')}
                                    accessibilityLabel="Traveler account type"
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selectedRole === 'TRAVELER' }}
                                    accessibilityHint="Select traveler account to explore places and write reviews">
                                    <Text
                                        style={[
                                            styles.roleName,
                                            selectedRole === 'TRAVELER' && styles.roleNameActive,
                                        ]}
                                    >
                                        Traveler
                                    </Text>
                                    <Text style={styles.roleDescription}>
                                        Explore places and write reviews
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.roleCard,
                                        selectedRole === 'OWNER' && styles.roleCardActive,
                                    ]}
                                    onPress={() => setSelectedRole('OWNER')}
                                    accessibilityLabel="Place Owner account type"
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selectedRole === 'OWNER' }}
                                    accessibilityHint="Select owner account to manage and promote your locations">
                                    <Text
                                        style={[
                                            styles.roleName,
                                            selectedRole === 'OWNER' && styles.roleNameActive,
                                        ]}
                                    >
                                        Place Owner
                                    </Text>
                                    <Text style={styles.roleDescription}>
                                        Manage and promote your locations
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.termsRow}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                            color={isChecked ? '#4630EB' : undefined}
                        accessibilityLabel="Agree to terms of service"
                        accessibilityHint="Check this box to agree to the terms of service"
                    />
                        <Text style={styles.text}>
                        I agree to the{' '}
                        <Text
                            style={styles.linkText}
                            onPress={() => nav.navigate('Terms of Service')}>
                            Terms of Service
                        </Text>
                    </Text>
                </View>

                    <View style={styles.containerChild}>
                        <Pressable
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={submitting}
                            accessibilityLabel="Create account"
                            accessibilityRole="button"
                            accessibilityHint="Tap to create your account">
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Create Account
                                </Text>
                            )}
                        </Pressable>
                    </View>
                    <View style={styles.socialSection}>
                        <View style={styles.lineContainer}>
                            <View style={styles.line} />
                            <Text style={styles.text}>Or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.containerGG_Apple}>
                            <Pressable
                                style={styles.buttonGG_Apple}
                                accessibilityLabel="Sign up with Google"
                                accessibilityRole="button">
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../../assets/images/google-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Google</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                style={styles.buttonGG_Apple}
                                accessibilityLabel="Sign up with Apple"
                                accessibilityRole="button" >
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../../assets/images/apple-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Apple</Text>
                                </View>
                            </Pressable>
                        </View>

                        <Text style={styles.loginFooterText}>
                            Already have an account? {''}
                            <Pressable
                                onPress={() => nav.navigate("Login")}
                                accessibilityLabel="Login"
                                accessibilityRole="link">
                                <Text style={styles.linkText}>
                                    Login
                                </Text>
                            </Pressable>
                        </Text>
                    </View>

                </View>
            </View>
        </ImageBackground>
    );
}
