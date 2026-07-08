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
import { useTheme } from '@/theme/ThemeContext';

type Profile = {
  user_id: number;
  username: string;
  email: string;
  profile_picture_url: string | null;
};

export default function ProfileScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const styles = createStyles(colors);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMe();
      setProfile(data);
    } catch (e) {
      // getMe throws + redirects to /login if token invalid
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
      setProfile((prev) => (prev ? { ...prev, profile_picture_url: updated.profile_picture_url } : prev));
    } catch (e: any) {
      Alert.alert('Upload failed', e.message);
    } finally {
      setUploadingPic(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header block — purple-tinted card like the mockup */}
      <View style={styles.profileHeader}>
        <Pressable onPress={handleChangePicture} disabled={uploadingPic}>
          {profile?.profile_picture_url ? (
            <Image
              source={{ uri: `${API_URL}${profile.profile_picture_url}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color={colors.textMuted} />
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

      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.setting}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: colors.primary }}
        />
      </View>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>About</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.setting}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    profileHeader: {
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      borderRadius: 24,
      paddingVertical: 40,
      marginTop: 50,
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
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primaryLight,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginTop: 12,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.card,
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
      color: colors.text,
    },
    logoutButton: {
      marginTop: 15,
      backgroundColor: colors.danger,
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