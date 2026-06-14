import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProductDetail() {
  return (
    <View style={styles.container}>
      <View style={styles.image} />

      <Text style={styles.name}>
        Nike Air Max 270
      </Text>

      <Text style={styles.price}>
        $129.99
      </Text>

      <Text style={styles.score}>
        🧠 AI Score: 92%
      </Text>

      <Text style={styles.reason}>
        Why recommended?
      </Text>

      <Text>✓ High rating</Text>
      <Text>✓ Strong reviews</Text>
      <Text>✓ Great discount</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>
          Save Product
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F8F9FB',
    padding:20
  },
  image:{
    height:280,
    borderRadius:25,
    backgroundColor:'white',
    marginTop:60
  },
  name:{
    fontSize:28,
    fontWeight:'700',
    marginTop:20
  },
  price:{
    color:'#7C3AED',
    fontSize:24,
    fontWeight:'700',
    marginTop:10
  },
  score:{
    marginTop:20,
    fontWeight:'600'
  },
  reason:{
    marginTop:25,
    fontSize:18,
    fontWeight:'600'
  },
  button:{
    backgroundColor:'#7C3AED',
    marginTop:30,
    padding:15,
    borderRadius:15
  },
  buttonText:{
    color:'white',
    textAlign:'center',
    fontWeight:'600'
  }
});