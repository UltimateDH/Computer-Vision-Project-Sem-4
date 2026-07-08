import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { API_URL, getMe, uploadProfilePicture } from '../../utils/api';

type Profile = {
  user_id: number;
  username: string;
  email: string;
  profile_picture_url: string | null;
};

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMe();
      setProfile(data);
    } catch (e) {
      // getMe throws + redirects to /login if token invalid, handled elsewhere
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleChangePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

  setUploadingPic(true);
    try {
      const updated = await uploadProfilePicture(result.assets[0].uri);
      console.log('Upload response:', JSON.stringify(updated));   // <-- add this line
      setProfile((prev) => (prev ? { ...prev, profile_picture_url: updated.profile_picture_url } : prev));
    } catch (e: any) {
    Alert.alert('Upload failed', e.message);
      } finally {
    setUploadingPic(false);
    }
  }
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Profile</Text>

      {/* Avatar + name/email */}
      <View style={styles.profileHeader}>
        <Pressable onPress={handleChangePicture} disabled={uploadingPic}>
          {profile?.profile_picture_url ? (
            <Image
              source={{ uri: `${API_URL}${profile.profile_picture_url}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color="#999" />
            </View>
          )}

          <View style={styles.editBadge}>
            {uploadingPic ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={16} color="white" />
            )}
          </View>
        </Pressable>

        <Text style={styles.name}>{profile?.username ?? '...'}</Text>
        <Text style={styles.email}>{profile?.email ?? ''}</Text>
      </View>

      {/* Settings */}
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.setting}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </Pressable>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>About</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </Pressable>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DDD',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F8F9FB',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
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
    marginTop: 15,
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