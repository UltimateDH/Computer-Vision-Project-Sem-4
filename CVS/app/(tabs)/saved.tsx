import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export default function SavedScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Saved Products</Text>
      <View style={styles.card} />
      <View style={styles.card} />
      <View style={styles.card} />
      <View style={styles.card} />
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    header: { fontSize: 32, fontWeight: '700', color: colors.text, marginTop: 50, marginBottom: 25 },
    card: { height: 140, borderRadius: 20, backgroundColor: colors.card, marginBottom: 20 },
  });