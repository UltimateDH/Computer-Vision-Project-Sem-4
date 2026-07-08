import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export default function FiltersScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filters</Text>
      <Text style={styles.label}>Categories</Text>

      <View style={styles.tags}>
        {['All', 'Shoes', 'Bags', 'Watches', 'Furniture'].map((item) => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Price Range</Text>
      <View style={styles.sliderPlaceholder} />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Apply Filters</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    header: { fontSize: 30, fontWeight: '700', color: colors.text, marginTop: 50 },
    label: { marginTop: 25, fontWeight: '600', color: colors.text },
    tags: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: { backgroundColor: colors.card, padding: 10, borderRadius: 20, margin: 5 },
    tagText: { color: colors.text },
    sliderPlaceholder: { height: 8, backgroundColor: colors.primary, borderRadius: 4, marginTop: 25 },
    button: { marginTop: 50, backgroundColor: colors.primary, padding: 16, borderRadius: 15 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
  });