import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SearchScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>AI Recommendations</Text>

      <Text style={styles.section}>Best Overall Choice</Text>

      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://americanhatmakers.com/cdn/shop/products/cabana-ivory-a_900x900_aee9ff0e-45c2-4ab8-b48a-95e25446365f.jpg?v=1714775440&width=1000',
          }}
          style={styles.image}
        />

        <Text style={styles.productName}>
          HAT
        </Text>

        <Text style={styles.rating}>
          ⭐ 4.8 (12,000 Reviews)
        </Text>

        <Text style={styles.price}>
          $129
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            View Details
          </Text>
        </Pressable>
      </View>

      <Text style={styles.section}>
        Best Budget Option
      </Text>

      <View style={styles.smallCard} />

      <Text style={styles.section}>
        Highest Rated
      </Text>

      <View style={styles.smallCard} />
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
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },

  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
  },

  rating: {
    color: '#666',
    marginTop: 6,
  },

  price: {
    color: '#7C3AED',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },

  button: {
    backgroundColor: '#7C3AED',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },

  smallCard: {
    height: 120,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
  },
});