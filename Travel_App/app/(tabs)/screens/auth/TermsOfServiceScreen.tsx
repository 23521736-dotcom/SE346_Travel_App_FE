import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.lastUpdated}>Last updated: June 2026</Text>

                <Text style={styles.paragraph}>
                    Welcome to Travel App. By downloading, accessing, or using the app, you agree to be bound by these Terms of Service. If you do not agree with any term, please do not use the app.
                </Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By creating an account or using our services, you confirm that you have read, understood, and agreed to these terms and our Privacy Policy.
                </Text>

                <Text style={styles.sectionTitle}>2. Service Description</Text>
                <Text style={styles.paragraph}>
                    Travel App helps users plan trips, discover and save favorite places, share travel experiences, manage itineraries, and review visited destinations.
                </Text>

                <Text style={styles.sectionTitle}>3. User Accounts</Text>
                <Text style={styles.paragraph}>
                    You are responsible for keeping your login information secure, providing accurate registration details, and notifying us if you suspect unauthorized access. Each user may create one personal account.
                </Text>

                <Text style={styles.sectionTitle}>4. Rules of Use</Text>
                <Text style={styles.paragraph}>
                    You agree not to use the service for unlawful purposes, interfere with our systems, copy protected materials without permission, post harmful content, or collect other user data without consent.
                </Text>

                <Text style={styles.sectionTitle}>5. User Content</Text>
                <Text style={styles.paragraph}>
                    You keep ownership of content you post. By posting content, you grant us permission to use, display, and distribute it as needed to provide the service. We may remove content that violates these terms.
                </Text>

                <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                    The app, design, logo, and app content belong to Travel App and are protected by copyright laws. You may not use our brand, logo, or content without written permission.
                </Text>

                <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                    The app is provided as is and as available. We do not guarantee uninterrupted, error-free, or completely secure service, and we are not liable for damages resulting from app use or inability to use the app.
                </Text>

                <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
                <Text style={styles.paragraph}>
                    We may update these terms at any time. Changes take effect when posted, and continued app use means you accept the updated terms.
                </Text>

                <Text style={styles.sectionTitle}>9. Contact</Text>
                <Text style={styles.paragraph}>
                    If you have questions or concerns about these Terms of Service, please contact us at:{'\n'}
                    Email: travelapp.support@gmail.com{'\n'}
                    We will try to respond within 2-3 business days.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backText: {
        fontSize: 16,
        color: '#177bb3',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
    },
    placeholder: {
        width: 50,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 50,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
});
