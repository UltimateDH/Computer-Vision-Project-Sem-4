import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateAndLogin = () => {
    let valid = true;

    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    // Password validation
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

    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛍️</Text>

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Sign in to continue
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {emailError ? (
        <Text style={styles.errorText}>{emailError}</Text>
      ) : null}

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <Pressable
        style={styles.loginButton}
        onPress={validateAndLogin}
      >
        <Text style={styles.loginText}>
          Login
        </Text>
      </Pressable>

      <Pressable>
        <Text style={styles.forgot}>
          Forgot Password?
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>

        <Pressable
          onPress={() => router.push('/signup')}
        >
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