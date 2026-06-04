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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletRow}>
        <Text style={styles.bulletMark}>-</Text>
        <Text style={styles.bulletText}>{children}</Text>
    </View>
);

export default function PrivacyPolicyScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.lastUpdated}>Last updated: June 2026</Text>

                <Text style={styles.paragraph}>
                    Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and how we protect your data when you use Travel App.
                </Text>

                <Section title="1. Information We Collect">
                    <Text style={styles.paragraph}>
                        We collect information that helps us provide a better and more personalized travel experience.
                    </Text>
                    <Bullet>
                        <Text style={styles.bold}>Personal information:</Text> name, email address, avatar, username, and account details you provide.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Travel activity:</Text> saved places, trip plans, reviews, ratings, and places you add to the app.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Device information:</Text> basic app usage data used to keep the service stable and secure.
                    </Bullet>
                </Section>

                <Section title="2. How We Use Information">
                    <Bullet>Create and manage your account.</Bullet>
                    <Bullet>Save your trips, favorite places, and travel preferences.</Bullet>
                    <Bullet>Improve app features, performance, and user experience.</Bullet>
                    <Bullet>Send important account, security, or service updates.</Bullet>
                    <Bullet>Support partner booking transactions.</Bullet>
                    <Bullet>Analyze trends to improve the service.</Bullet>
                </Section>

                <Section title="3. Information Sharing">
                    <Text style={styles.paragraph}>
                        We do not sell your personal information. We may share limited information when needed to operate the app, comply with legal requirements, or protect users and our service.
                    </Text>
                    <Bullet>
                        <Text style={styles.bold}>Service partners:</Text> providers that support booking, payment, and app operations.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Legal requests:</Text> when required by law or to protect our rights.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Ownership changes:</Text> in the event of a merger or sale of part or all of our assets.
                    </Bullet>
                </Section>

                <Section title="4. Data Storage and Security">
                    <Text style={styles.paragraph}>
                        We use reasonable technical and organizational measures to protect your information. Data is stored on protected servers and encrypted during transmission. No digital service can guarantee complete security, so please keep your login information private.
                    </Text>
                    <Text style={styles.paragraph}>
                        We keep your data for as long as needed to provide the service and comply with legal obligations. When an account is deleted, we delete or anonymize personal data within 30 days.
                    </Text>
                </Section>

                <Section title="5. Your Rights">
                    <Bullet>You can update profile information in your account.</Bullet>
                    <Bullet>You can manage notification preferences from the Profile screen.</Bullet>
                    <Bullet>You can request review or deletion of your data by contacting us.</Bullet>
                    <Bullet>You can withdraw consent for data collection at any time.</Bullet>
                    <Bullet>You can request a copy of your personal data.</Bullet>
                </Section>

                <Section title="6. Cookies and Tracking Technologies">
                    <Text style={styles.paragraph}>
                        We use cookies and similar technologies to remember your activity, understand how users use the app, improve the service, and provide a personalized experience. You can manage cookies in your device settings.
                    </Text>
                </Section>

                <Section title="7. Policy Changes">
                    <Text style={styles.paragraph}>
                        We may update this policy over time. Changes will be announced through the app. Continued use after changes take effect means you accept the updated policy.
                    </Text>
                </Section>

                <Section title="8. Contact">
                    <Text style={styles.paragraph}>
                        If you have questions about this Privacy Policy, please contact us at:{'\n'}
                        Email: travelapp.support@gmail.com{'\n'}
                        We will try to respond within 2-3 business days.
                    </Text>
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 12,
        minWidth: 72,
    },
    backText: {
        fontSize: 16,
        color: '#177bb3',
        fontWeight: '700',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    placeholder: {
        width: 72,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    section: {
        marginTop: 22,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#177bb3',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    bulletMark: {
        width: 16,
        fontSize: 15,
        lineHeight: 24,
        color: '#177bb3',
        fontWeight: '800',
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    bold: {
        fontWeight: '700',
        color: '#1e293b',
    },
});
