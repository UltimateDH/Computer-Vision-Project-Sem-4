import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚀</Text>

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Join the AI Shopping Assistant
      </Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.signupButton}>
        <Text style={styles.signupText} onPress={() => router.push('/(tabs)')}>
          Create Account
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>

        <Pressable
          onPress={() => router.push('/login')}
        >
          <Text style={styles.link}>
            {' '}Login
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

  signupButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 15,
  },

  signupText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
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