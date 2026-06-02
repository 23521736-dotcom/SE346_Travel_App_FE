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
                <Text style={styles.lastUpdated}>Last Updated: May 2026</Text>

                <Text style={styles.paragraph}>
                    Welcome to our application. By downloading, accessing, or using the
                    app, you agree to be bound by these Terms of Service. If you do not
                    agree with any of these terms, please do not use the app.
                </Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By creating an account or using our services, you confirm that you
                    have read, understood, and agree to be bound by these terms, as well
                    as our Privacy Policy.
                </Text>

                <Text style={styles.sectionTitle}>2. User Accounts</Text>
                <Text style={styles.paragraph}>
                    • You are responsible for maintaining the confidentiality of your
                    account credentials. {'\n'}
                    • You agree to provide accurate information upon registration and
                    update it if it changes. {'\n'}
                    • You must notify us immediately if you suspect any unauthorized
                    access to your account.
                </Text>

                <Text style={styles.sectionTitle}>3. Privacy & Data</Text>
                <Text style={styles.paragraph}>
                    We respect your privacy. Any personal information you provide is
                    collected, stored, and used in accordance with our Privacy Policy. We
                    do not sell your personal data to third parties.
                </Text>

                <Text style={styles.sectionTitle}>4. Prohibited Conduct</Text>
                <Text style={styles.paragraph}>
                    While using the app, you agree NOT to:{'\n'}
                    • Use the services for any illegal or unauthorized purpose.{'\n'}
                    • Attempt to interfere with, disrupt, or gain unauthorized access to
                    our servers or networks.{'\n'}
                    • Copy, modify, or distribute our copyrighted materials without
                    permission.
                </Text>

                <Text style={styles.sectionTitle}>5. Disclaimer of Warranties</Text>
                <Text style={styles.paragraph}>
                    The app is provided on an "as is" and "as available" basis. We do not
                    warrant that the app will be uninterrupted, error-free, or completely
                    secure. We shall not be liable for any damages arising from your use
                    or inability to use the app.
                </Text>

                <Text style={styles.sectionTitle}>6. Modifications</Text>
                <Text style={styles.paragraph}>
                    We reserve the right to modify or update these terms at any time.
                    Changes will be effective immediately upon posting. Your continued use
                    of the app constitutes acceptance of the modified terms.
                </Text>

                <Text style={styles.sectionTitle}>7. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions or concerns regarding these Terms of
                    Service, please contact our Support team through the app.
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
