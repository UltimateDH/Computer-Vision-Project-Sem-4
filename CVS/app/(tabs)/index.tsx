import { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Camera permission required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Product Finder
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="📷 Take Photo"
          onPress={takePhoto}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="📁 Upload Image"
          onPress={uploadImage}
        />
      </View>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.preview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },

  preview: {
    width: 300,
    height: 300,
    marginTop: 30,
    borderRadius: 12,
  },
});