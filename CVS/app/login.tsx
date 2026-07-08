import { router } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login } from '../utils/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateAndLogin = async () => {
    let valid = true;

    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setServerError('');

    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

    if (!valid) {
      return;
    }

    try {
      // Added username to the login API call
      const { access_token } = await login(username, email, password);
      await SecureStore.setItemAsync('token', access_token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#999"
        style={styles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <Pressable style={styles.loginButton} onPress={validateAndLogin}>
        <Text style={styles.loginText}>Login</Text>
      </Pressable>

      <Pressable>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.link}> Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    padding: 25,
  },

  logo: {
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 40,
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 8,
  },

  errorText: {
    color: '#DC2626',
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 13,
  },

  loginButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
  },

  loginText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },

  forgot: {
    textAlign: 'center',
    color: '#7C3AED',
    marginTop: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },

  link: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});