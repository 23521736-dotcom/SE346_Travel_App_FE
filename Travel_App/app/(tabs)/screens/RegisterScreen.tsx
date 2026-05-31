import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';
import styles from './RegisterScreen.styles';

export default function RegisterScreen({ navigation }: any) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('Loi', 'Vui long dong y dieu khoan su dung');
      return;
    }

    if (!email.trim() || !password) {
      Alert.alert('Loi', 'Vui long nhap email va mat khau');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Loi', 'Mat khau phai co it nhat 8 ky tu');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Loi', 'Mat khau xac nhan khong khop');
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password, fullName.trim() || undefined);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      Alert.alert('Dang ky that bai', msg === 'EMAIL_TAKEN' ? 'Email da duoc su dung' : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <View style={styles.imageFrame}>
            <Image
              source={{ uri: 'https://i.pinimg.com/736x/ed/d9/86/edd98622650c6f964291fef1a968adc6.jpg' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 35, textAlign: 'center', marginTop: 5 }}>
            Start your Journey
          </Text>
          <Text style={[styles.text, { marginTop: 5 }]}>
            Create an account to explore the world
          </Text>
        </View>

        <View style={[styles.inputContainer, { marginTop: 20 }]}>
          <Image
            source={require('../../../assets/images/user-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Full Name"
            style={{ flex: 1 }}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/email-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Email Address"
            style={{ flex: 1 }}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/password-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            style={{ flex: 1 }}
            autoCorrect={false}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible((current) => !current)}>
            <Image
              source={
                isPasswordVisible
                  ? require('../../../assets/images/hidden_eyepassword-icon.png')
                  : require('../../../assets/images/eyepassword-icon.png')
              }
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/cfpassword-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!isConfirmPasswordVisible}
            style={{ flex: 1 }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible((current) => !current)}>
            <Image
              source={
                isConfirmPasswordVisible
                  ? require('../../../assets/images/hidden_eyepassword-icon.png')
                  : require('../../../assets/images/eyepassword-icon.png')
              }
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#4630EB' : undefined}
          />
          <Text>
            I agree to the{' '}
            <Text style={styles.linkText} onPress={() => Alert.alert('Terms', 'Terms & Conditions')}>
              Terms & Conditions
            </Text>
          </Text>
        </View>

        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Pressable style={styles.button} onPress={handleRegister} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <View style={styles.line} />
          <Text style={[styles.text, { marginVertical: 10 }]}>Or sign up with</Text>
          <View style={styles.line} />

          <View style={styles.containerGG_Apple}>
            <Pressable style={styles.buttonGG_Apple} onPress={() => Alert.alert('Google')}>
              <View style={styles.containerImageGG_Apple}>
                <Image
                  source={require('../../../assets/images/google-icon.png')}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />
                <Text style={styles.buttonGG_AppleText}>Google</Text>
              </View>
            </Pressable>

            <Pressable style={styles.buttonGG_Apple} onPress={() => Alert.alert('Apple')}>
              <View style={styles.containerImageGG_Apple}>
                <Image
                  source={require('../../../assets/images/apple-icon.png')}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />
                <Text style={styles.buttonGG_AppleText}>Apple</Text>
              </View>
            </Pressable>
          </View>

          <Text style={[styles.text, { marginVertical: 10 }]}>
            Already have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
