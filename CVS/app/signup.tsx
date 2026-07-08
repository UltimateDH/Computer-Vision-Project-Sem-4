import { router } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { signup } from '../utils/api';
import { useTheme } from '@/theme/ThemeContext';

export default function SignupScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [username, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [address, setAddress] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateAndSignup = async () => {
    let valid = true;
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');

    if (!username.trim()) {
      setFullNameError('Username is required');
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }
    if (!valid) return;

    try {
      const { access_token } = await signup(username, email, password, phoneNum || undefined, address || undefined);
      await SecureStore.setItemAsync('token', access_token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the AI Shopping Assistant</Text>

      <TextInput placeholder="Full Name" placeholderTextColor={colors.textMuted} style={styles.input} value={username} onChangeText={setFullName} />
      {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

      <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={styles.input} value={email} onChangeText={setEmail} />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TextInput placeholder="Confirm Password" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <TextInput placeholder="Phone Number (optional)" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" style={styles.input} value={phoneNum} onChangeText={setPhoneNum} />
      <TextInput placeholder="Address (optional)" placeholderTextColor={colors.textMuted} style={styles.input} value={address} onChangeText={setAddress} />

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <Pressable style={styles.signupButton} onPress={validateAndSignup}>
        <Text style={styles.signupText}>Create Account</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={{ color: colors.text }}>Already have an account?</Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}> Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 25 },
    title: { fontSize: 34, fontWeight: '700', textAlign: 'center', color: colors.text },
    subtitle: { textAlign: 'center', color: colors.textSecondary, marginTop: 8, marginBottom: 40 },
    input: { backgroundColor: colors.card, borderRadius: 15, padding: 16, marginBottom: 8, color: colors.text },
    errorText: { color: '#DC2626', fontSize: 13, marginBottom: 12, marginLeft: 4 },
    signupButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 15, marginTop: 10 },
    signupText: { color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    link: { color: colors.primary, fontWeight: '600' },
  });