import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Platform, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../common/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning-outline" size={80} color={colors.primary} />
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              An unexpected error occurred. Please try again or go back to the previous screen.
            </Text>

            {this.state.error && (
              <View style={styles.errorDetailsContainer}>
                <Pressable
                  style={styles.errorDetailsHeader}
                  onPress={() => {
                    // Toggle error details visibility
                    this.setState((prev) => ({
                      ...prev,
                      errorInfo: prev.errorInfo ? null : this.state.errorInfo,
                    }));
                  }}
                >
                  <Text style={styles.errorDetailsTitle}>Error Details</Text>
                  <Ionicons
                    name={this.state.errorInfo ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {this.state.errorInfo && (
                  <ScrollView style={styles.errorDetailsScroll}>
                    <Text style={styles.errorText}>
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </ScrollView>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={this.handleGoBack}>
                <Ionicons name="arrow-back" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Go Back</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.buttonSecondary]} onPress={this.handleReset}>
                <Ionicons name="refresh" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Try Again</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  errorDetailsContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  errorDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surfaceMuted,
  },
  errorDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorDetailsScroll: {
    maxHeight: 200,
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
  },
  buttonSecondary: {
    backgroundColor: colors.textPrimary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
