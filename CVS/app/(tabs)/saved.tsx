import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SavedScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        ❤️ Saved Products
      </Text>

      <View style={styles.card} />
      <View style={styles.card} />
      <View style={styles.card} />
      <View style={styles.card} />
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
    marginBottom: 25,
  },

  card: {
    height: 140,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
});