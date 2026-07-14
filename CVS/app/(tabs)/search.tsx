import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import type { SearchResponse, SearchResult } from '../../utils/api';
import { rewardListing } from '../../utils/api';

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { data } = useLocalSearchParams<{ data?: string }>();

  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [boughtIds, setBoughtIds] = useState<Set<string>>(new Set());

  const parsed: SearchResponse | null = data ? JSON.parse(data) : null;
  const results = parsed?.results ?? [];

  if (!parsed || results.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>AI Recommendations</Text>
        <Text style={styles.empty}>No search yet — take or upload a photo to get recommendations.</Text>
      </ScrollView>
    );
  }

  const bestOverall = results[0];
  const cheapest = [...results]
    .filter((r) => r.id !== bestOverall.id)
    .sort((a, b) => a.price - b.price)[0] ?? bestOverall;
  const highestRated = [...results]
    .filter((r) => r.id !== bestOverall.id && r.id !== cheapest.id)
    .sort((a, b) => b.rating - a.rating)[0] ?? cheapest;
  const rest = results.filter(
    (r) => r.id !== bestOverall.id && r.id !== cheapest.id && r.id !== highestRated.id
  );

  const handleBuy = async (item: SearchResult) => {
    setBuyingId(item.id);
    try {
      await rewardListing(item.id);
      setBoughtIds((prev) => new Set(prev).add(item.id));
      Alert.alert('Purchase recorded', `Thanks for buying ${item.name}!`);
    } catch (e: any) {
      Alert.alert('Something went wrong', e.message);
    } finally {
      setBuyingId(null);
    }
  };

  const renderCard = (item: SearchResult, sectionKey: string) => {
    const isBuying = buyingId === item.id;
    const isBought = boughtIds.has(item.id);

    return (
      <View style={styles.card} key={`${sectionKey}-${item.id}`}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.rating}>⭐ {item.rating} ({item.reviews.toLocaleString()} Reviews)</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.match}>{Math.round(item.similarity_score * 100)}% match</Text>
        <Pressable
          style={[styles.button, isBought && styles.buttonBought]}
          onPress={() => handleBuy(item)}
          disabled={isBuying || isBought}
        >
          {isBuying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>{isBought ? 'Bought ✓' : 'Buy'}</Text>
          )}
        </Pressable>
      </View>
    );
  };

  const renderSmallCard = (item: SearchResult) => {
    const isBuying = buyingId === item.id;
    const isBought = boughtIds.has(item.id);

    return (
      <View style={styles.smallCardRow}>
        <Image source={{ uri: item.image_url }} style={styles.smallImage} />
        <View style={styles.smallInfo}>
          <Text style={styles.smallName}>{item.name}</Text>
          <Text style={styles.smallDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.smallPrice}>${item.price} · {Math.round(item.similarity_score * 100)}% match</Text>
        </View>
        <Pressable
          style={[styles.smallBuyButton, isBought && styles.buttonBought]}
          onPress={() => handleBuy(item)}
          disabled={isBuying || isBought}
        >
          {isBuying ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.smallBuyButtonText}>{isBought ? '✓' : 'Buy'}</Text>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>AI Recommendations</Text>

      <Text style={styles.section}>Best Overall Choice</Text>
      {renderCard(bestOverall, 'best')}

      <Text style={styles.section}>Best Budget Option</Text>
      {renderCard(cheapest, 'budget')}

      <Text style={styles.section}>Highest Rated</Text>
      {renderCard(highestRated, 'rated')}

      {rest.length > 0 && (
        <>
          <Text style={styles.section}>More Matches</Text>
          <FlatList
            data={rest}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => renderSmallCard(item)}
          />
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    header: { fontSize: 32, fontWeight: '700', color: colors.text, marginTop: 50, marginBottom: 20 },
    empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
    section: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 },
    card: { backgroundColor: colors.card, borderRadius: 20, padding: 15, marginBottom: 25 },
    image: { width: '100%', height: 220, borderRadius: 16 },
    productName: { fontSize: 20, fontWeight: '600', color: colors.text, marginTop: 15 },
    description: { color: colors.textSecondary, marginTop: 4 },
    rating: { color: colors.textSecondary, marginTop: 6 },
    price: { color: colors.primary, fontSize: 22, fontWeight: '700', marginTop: 8 },
    match: { color: colors.textMuted, marginTop: 4, fontSize: 12 },
    button: { backgroundColor: colors.primary, padding: 15, borderRadius: 12, marginTop: 15, minHeight: 50, justifyContent: 'center' },
    buttonBought: { backgroundColor: colors.textMuted },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
    smallCardRow: {
      flexDirection: 'row', backgroundColor: colors.card, borderRadius: 16,
      padding: 12, marginBottom: 12, alignItems: 'center',
    },
    smallImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#DDD' },
    smallInfo: { marginLeft: 12, flex: 1 },
    smallName: { fontWeight: '600', color: colors.text },
    smallDescription: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
    smallPrice: { color: colors.primary, fontSize: 12, marginTop: 4, fontWeight: '500' },
    smallBuyButton: {
      backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14,
      marginLeft: 8, minWidth: 50, alignItems: 'center', justifyContent: 'center',
    },
    smallBuyButtonText: { color: 'white', fontWeight: '600', fontSize: 12 },
  });
