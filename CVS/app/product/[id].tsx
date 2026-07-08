import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export default function ProductDetail() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.image} />

      <Text style={styles.name}>Nike Air Max 270</Text>
      <Text style={styles.price}>$129.99</Text>
      <Text style={styles.score}>AI Score: 92%</Text>
      <Text style={styles.reason}>Why recommended?</Text>

      <Text style={styles.checkItem}>✓ High rating</Text>
      <Text style={styles.checkItem}>✓ Strong reviews</Text>
      <Text style={styles.checkItem}>✓ Great discount</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Save Product</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    image: { height: 280, borderRadius: 25, backgroundColor: colors.card, marginTop: 60 },
    name: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 20 },
    price: { color: colors.primary, fontSize: 24, fontWeight: '700', marginTop: 10 },
    score: { color: colors.text, marginTop: 20, fontWeight: '600' },
    reason: { color: colors.text, marginTop: 25, fontSize: 18, fontWeight: '600' },
    checkItem: { color: colors.textSecondary, marginTop: 4 },
    button: { backgroundColor: colors.primary, marginTop: 30, padding: 15, borderRadius: 15 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
  });