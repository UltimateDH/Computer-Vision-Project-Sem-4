import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { API_URL, getImages } from '../../utils/api';

type ImageItem = {
  id: string;
  original_name: string;
  source: string;
  uploaded_at: string;
  url: string;
};

export default function HistoryScreen() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 const fetchImages = useCallback(async () => {
  try {
    const data = await getImages();
    console.log('Fetched images:', data);
    setImages(data);
  } catch (e) {
    console.error('Failed to fetch images:', e); // <-- was silently swallowed before
  } finally {
    setLoading(false);
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [fetchImages])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchImages();
    setRefreshing(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>History</Text>

      {images.length === 0 && (
        <Text style={styles.empty}>No photos yet — tap the camera to get started.</Text>
      )}

      {images.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: `${API_URL}${item.url}` }} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.title}>
              {item.source === 'camera' ? 'Captured photo' : 'Uploaded from album'}
            </Text>

            <Text style={styles.subtitle}>{formatDate(item.uploaded_at)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
  },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 50,
    marginBottom: 20,
  },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#DDD',
  },
  info: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
});