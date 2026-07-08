import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { API_URL, getImages } from '../../utils/api';
import { useTheme } from '@/theme/ThemeContext';

type ImageItem = {
  id: string;
  original_name: string;
  source: string;
  uploaded_at: string;
  url: string;
};

export default function HistoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const data = await getImages();
      setImages(data);
    } catch (e) {
      // handled elsewhere
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
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    centered: { justifyContent: 'center', alignItems: 'center' },
    header: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.text,
      marginTop: 50,
      marginBottom: 20,
    },
    empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
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
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
      marginTop: 4,
    },
  });