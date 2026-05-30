import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { uploadAvatar } from '../../../lib/api/uploads';
import { updateMe } from '../../../lib/api/users';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';
import styles from './EditProfileScreen.styles';

const DEFAULT_AVATAR =
  'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';

export default function EditProfileScreen({ navigation }: any) {
    const { user, refreshUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || user.name || '');
            setEmail(user.email || '');
            setUsername(user.username || '');
            setLocation(user.location || '');
            setAvatarPreview('');
        }
    }, [user]);

    const handleAvatarChange = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Loi', 'Can quyen truy cap thu vien anh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatarPreview(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            Alert.alert('Loi', 'Vui long nhap email');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
            Alert.alert('Loi', 'Email khong hop le');
            return;
        }

        setSaving(true);
        try {
            const avatarUrl = avatarPreview ? await uploadAvatar(avatarPreview) : undefined;
            await updateMe({
                email: trimmedEmail,
                fullName: fullName.trim() || undefined,
                username: username.trim() || undefined,
                location: location.trim() || undefined,
                avatarUrl,
            });
            await refreshUser();
            navigation.goBack();
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text = msg === 'USERNAME_TAKEN'
                ? 'Username da duoc su dung'
                : msg === 'EMAIL_TAKEN'
                    ? 'Email da duoc su dung'
                    : msg;
            Alert.alert('Loi', text);
        } finally {
            setSaving(false);
        }
    };

    const avatar = avatarPreview || user?.avatarUrl || DEFAULT_AVATAR;

    return (
        <View style={{ flex: 1, justifyContent:'center', marginTop: 0, backgroundColor: '#FFFFFF' }}>
            <View style={[styles.container]}>
                <View style={{alignItems:'center'}}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <Image source={{uri: avatar}}
                                style={{width: '100%', height: '100%'}}>
                            </Image>
                        </View>

                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={handleAvatarChange}
                            activeOpacity={0.7}
                        >
                            <Image source={{uri: 'https://cdn-icons-png.flaticon.com/128/14025/14025489.png'}}
                                style={{width: '100%', height: '100%'}}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        FULL NAME
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0}]}>
                        <TextInput value={fullName} onChangeText={setFullName} style={{ flex: 1 }} />
                    </View>
                </View>

                <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        EMAIL
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0}]}>
                        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/128/646/646094.png'}}
                            style={{width: 20, height: 20, marginRight: 5, marginTop: 2}}>
                        </Image>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={{ flex: 1 }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                 <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        USERNAME
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0, rowGap: 10}]}>
                        <TextInput value={username} onChangeText={setUsername} style={{ flex: 1 }} autoCapitalize="none" />
                    </View>
                </View>

                <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        LOCATION
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0}]}>
                        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/128/9800/9800512.png'}}
                            style={{width: 20, height: 20, marginRight: 5, marginTop: 2}}>
                        </Image>
                        <TextInput value={location} onChangeText={setLocation} style={{ flex: 1 }} />
                    </View>
                </View>

                <View style={[styles.containerChild, {marginTop: 10, alignItems:'center'}]}>
                    <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Save Changes</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
