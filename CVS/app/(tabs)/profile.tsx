import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Profile
      </Text>

      <View style={styles.card}>
        <Text style={styles.setting}>
          Dark Mode
        </Text>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.setting}>
          Notifications
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.setting}>
          About
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.setting}>
          Privacy Policy
        </Text>
      </View>

    <Pressable
    style={styles.logoutButton}
    onPress={() => router.replace('/login')}
    >
    <Text style={styles.logoutText}>
      Logout
    </Text>
    </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
  },

header: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 50,
    marginBottom: 25,
  },

card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

setting: {
    fontSize: 16,
    fontWeight: '500',
  },

logoutButton: {
  marginTop: 30,
  backgroundColor: '#EF4444',
  padding: 16,
  borderRadius: 18,
  alignItems: 'center',
  },

logoutText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
  },
});