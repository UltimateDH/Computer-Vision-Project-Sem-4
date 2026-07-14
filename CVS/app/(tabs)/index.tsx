import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { searchImage } from '../../utils/api';
import { useTheme } from '@/theme/ThemeContext';
import * as ImageManipulator from 'expo-image-manipulator';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [source, setSource] = useState<'camera' | 'album' | null>(null);
  const [uploading, setUploading] = useState(false);

  const resizeImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // downscale, keeps aspect ratio
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  };

  const handlePickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setImageUri(resizedUri);
      setSource('album');
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission is required');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setImageUri(resizedUri);
      setSource('camera');
    }
  };

  const handleRetake = () => {
    setImageUri(null);
    setSource(null);
  };

  const handleUpload = async () => {
    if (!imageUri || !source) return;
    setUploading(true);
    try {
      const data = await searchImage(imageUri, source);
      router.push({
        pathname: '/search',
        params: { data: JSON.stringify(data) },
      });
      setImageUri(null);
      setSource(null);
    } catch (e: any) {
      Alert.alert('Search failed', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Find anything{'\n'}
          with a photo
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {!imageUri && (
          <View style={styles.actionRow}>
            <Pressable style={styles.cameraCard} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={34} color="white" />
              <Text style={styles.cardTitleWhite}>Take Photo</Text>
              <Text style={styles.cardSubtitleWhite}>Use camera</Text>
            </Pressable>

            <Pressable style={styles.uploadCard} onPress={handlePickFromLibrary}>
              <Ionicons name="image" size={34} color={colors.primary} />
              <Text style={styles.cardTitle}>Upload Image</Text>
              <Text style={styles.cardSubtitle}>From gallery</Text>
            </Pressable>
          </View>
        )}

        {imageUri && (
          <>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />

            <View style={styles.actionRow}>
              <Pressable style={styles.retakeButton} onPress={handleRetake} disabled={uploading}>
                <Text style={styles.retakeText}>Retake</Text>
              </Pressable>

              <Pressable style={styles.uploadButton} onPress={handleUpload} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload</Text>
                )}
              </Pressable>
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.recentRow}>
          <View style={styles.recentCard} />
          <View style={styles.recentCard} />
          <View style={styles.recentCard} />
          <View style={styles.recentCard} />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 70 },
    title: { fontSize: 38, fontWeight: '700', color: colors.text, marginTop: 10, marginBottom: 25, lineHeight: 45 },
    searchContainer: {
      height: 55, backgroundColor: colors.card, borderRadius: 16,
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 25,
    },
    searchInput: { flex: 1, marginLeft: 10, color: colors.text },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    cameraCard: { width: '48%', backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 30, alignItems: 'center' },
    uploadCard: { width: '48%', backgroundColor: colors.primaryLight, borderRadius: 20, paddingVertical: 30, alignItems: 'center' },
    cardTitleWhite: { color: 'white', fontWeight: '600', marginTop: 12, fontSize: 16 },
    cardSubtitleWhite: { color: '#E5E7EB', marginTop: 4, fontSize: 12 },
    cardTitle: { color: colors.text, fontWeight: '600', marginTop: 12, fontSize: 16 },
    cardSubtitle: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
    retakeButton: {
      width: '48%', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
      borderWidth: 1, borderColor: colors.primary,
    },
    retakeText: { color: colors.primary, fontWeight: '600', fontSize: 16 },
    uploadButton: {
      width: '48%', backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    },
    uploadButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
    sectionHeader: { marginTop: 35, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
    seeAll: { color: colors.primary, fontWeight: '500' },
    recentRow: { flexDirection: 'row', justifyContent: 'space-between' },
    recentCard: { width: 72, height: 72, borderRadius: 16, backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    previewImage: { width: '100%', height: 250, borderRadius: 20, marginTop: 25 },
    content: { paddingBottom: 40 },
  });