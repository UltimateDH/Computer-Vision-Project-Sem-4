import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.close}>
        <Ionicons name="close" size={30} color="white" />
      </Pressable>

      <View style={styles.preview}>
        <View style={styles.focusBox} />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.mode}>PHOTO</Text>

        <Pressable style={styles.captureOuter}>
          <View style={styles.captureInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000'},
  close:{position:'absolute',top:60,left:20,zIndex:2},
  preview:{flex:1,justifyContent:'center',alignItems:'center'},
  focusBox:{
    width:220,
    height:220,
    borderWidth:3,
    borderColor:'white',
    borderRadius:20,
  },
  bottom:{
    height:150,
    alignItems:'center',
    justifyContent:'center',
  },
  mode:{
    color:'#7C3AED',
    marginBottom:20,
    fontWeight:'600'
  },
  captureOuter:{
    width:80,
    height:80,
    borderRadius:40,
    borderWidth:5,
    borderColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  captureInner:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:'#7C3AED'
  }
});