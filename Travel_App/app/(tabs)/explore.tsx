import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function ExploreScreen() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
				<Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Explore</Text>
				<Text style={{ color: '#6b7280', textAlign: 'center' }}>
					This tab route is now valid so Expo Router won\'t 404 or warn on web.
				</Text>
			</View>
		</SafeAreaView>
	);
}

