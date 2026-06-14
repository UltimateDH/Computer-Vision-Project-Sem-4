import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛍️</Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Sign in to continue
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.loginButton}>
        <Text style={styles.loginText} onPress={() => router.push('/(tabs)')}>
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
          <Text style={styles.link}>
            {' '}Sign Up
          </Text>
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
    marginBottom: 15,
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