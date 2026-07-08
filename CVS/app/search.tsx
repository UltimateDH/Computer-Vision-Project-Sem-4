import { useLocalSearchParams } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import type { SearchResponse } from '../utils/api';

export default function ResultsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { data } = useLocalSearchParams<{ data: string }>();

  const parsed: SearchResponse | null = data ? JSON.parse(data) : null;

  if (!parsed) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>No results</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Similar Products</Text>

      <FlatList
        data={parsed.results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.score}>{Math.round(item.similarity_score * 100)}% match</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    header: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: 50, marginBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: colors.card, padding: 12, borderRadius: 15, marginBottom: 12 },
    image: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#DDD' },
    info: { marginLeft: 15, justifyContent: 'center', flex: 1 },
    name: { fontWeight: '600', color: colors.text },
    description: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
    score: { color: colors.primary, marginTop: 4, fontWeight: '500', fontSize: 12 },
  });