import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const uploadImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

const takePhoto = async () => {
  const permission =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    alert('Camera permission is required');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Good Morning 👋</Text>

      {/* Hero Title */}
      <Text style={styles.title}>
        Find anything{'\n'}
        with a photo
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search for products..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Action Cards */}
      <View style={styles.actionRow}>
        <Pressable style={styles.cameraCard} onPress={takePhoto}>
          <Ionicons name="camera" size={34} color="white" />
          <Text style={styles.cardTitleWhite}>Take Photo</Text>
          <Text style={styles.cardSubtitleWhite}>Use camera</Text>
        </Pressable>

        <Pressable style={styles.uploadCard} onPress={uploadImage}>
          <Ionicons name="image" size={34} color="#3B82F6" />
          <Text style={styles.cardTitle}>Upload Image</Text>
          <Text style={styles.cardSubtitle}>From gallery</Text>
        </Pressable>
        </View>

        {imageUri && (
        <Image
        source={{ uri: imageUri }}
        style={styles.previewImage}
        />
        )}



      {/* Recent Searches */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  greeting: {
    fontSize: 16,
    color: '#666',
  },

  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 45,
  },

  searchContainer: {
    height: 55,
    backgroundColor: '#EFEFF4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#111',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cameraCard: {
    width: '48%',
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },

  uploadCard: {
    width: '48%',
    backgroundColor: '#EAF2FF',
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },

  cardTitleWhite: {
    color: 'white',
    fontWeight: '600',
    marginTop: 12,
    fontSize: 16,
  },

  cardSubtitleWhite: {
    color: '#E5E7EB',
    marginTop: 4,
    fontSize: 12,
  },

  cardTitle: {
    color: '#111',
    fontWeight: '600',
    marginTop: 12,
    fontSize: 16,
  },

  cardSubtitle: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },

  sectionHeader: {
    marginTop: 35,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },

  seeAll: {
    color: '#7C3AED',
    fontWeight: '500',
  },

  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  recentCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  previewImage: {
  width: '100%',
  height: 250,
  borderRadius: 20,
  marginTop: 25,
  },

  content: {
  paddingBottom: 40,
  },
});