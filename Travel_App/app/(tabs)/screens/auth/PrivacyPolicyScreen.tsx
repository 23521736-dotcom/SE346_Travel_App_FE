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
                <Text style={styles.lastUpdated}>Last Updated: May 2026</Text>

                <Text style={styles.paragraph}>
                    Your privacy matters to us. This Privacy Policy explains what
                    information we collect, how we use it, and how we protect your data
                    when you use our travel application.
                </Text>

                <Section title="1. Information We Collect">
                    <Text style={styles.paragraph}>
                        We collect information that helps us provide a better and more
                        personalized travel experience.
                    </Text>
                    <Bullet>
                        <Text style={styles.bold}>Personal information:</Text> name,
                        email address, avatar, username, and account details you provide.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Travel activity:</Text> saved places,
                        trip plans, reviews, ratings, and locations you add to the app.
                    </Bullet>
                    <Bullet>
                        <Text style={styles.bold}>Device information:</Text> basic app
                        usage data used to keep the service stable and secure.
                    </Bullet>
                </Section>

                <Section title="2. How We Use Your Information">
                    <Bullet>Create and manage your account.</Bullet>
                    <Bullet>Save your trips, favorite places, and travel preferences.</Bullet>
                    <Bullet>Improve app features, performance, and user experience.</Bullet>
                    <Bullet>Send important account, security, or service updates.</Bullet>
                </Section>

                <Section title="3. Sharing Your Information">
                    <Text style={styles.paragraph}>
                        We do not sell your personal information. We may share limited
                        information only when it is needed to operate the app, comply with
                        legal requirements, or protect our users and services.
                    </Text>
                </Section>

                <Section title="4. Data Security">
                    <Text style={styles.paragraph}>
                        We use reasonable technical and organizational measures to protect
                        your information. However, no digital service can guarantee
                        complete security, so please keep your account credentials private.
                    </Text>
                </Section>

                <Section title="5. Your Choices">
                    <Bullet>You can update your profile information in your account.</Bullet>
                    <Bullet>You can manage notification preferences from the Profile screen.</Bullet>
                    <Bullet>You may contact us to request review or deletion of your data.</Bullet>
                </Section>

                <Section title="6. Contact Us">
                    <Text style={styles.paragraph}>
                        If you have any questions about this Privacy Policy, please contact
                        our support team through the app.
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
