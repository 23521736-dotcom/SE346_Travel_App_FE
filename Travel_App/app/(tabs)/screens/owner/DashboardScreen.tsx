import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LogoutScreen({ navigation }: any) {
    const { logout } = useAuth();
    return (
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 40, backgroundColor: '#FFFFFF' }}>
            <View style={{ alignItems: 'center', margin: 10 }}>
                <Text> DASHBOARD</Text>
            </View>
        </View>
    );

}