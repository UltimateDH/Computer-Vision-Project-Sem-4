import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>History</Text>

      {[1,2,3,4].map(item => (
        <View key={item} style={styles.card}>
          <View style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.title}>
              Nike Air Max 270
            </Text>

            <Text style={styles.subtitle}>
              24 similar products
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F8F9FB',
    padding:20
  },
  header:{
    fontSize:30,
    fontWeight:'700',
    marginTop:50,
    marginBottom:20
  },
  card:{
    flexDirection:'row',
    backgroundColor:'white',
    padding:12,
    borderRadius:15,
    marginBottom:15
  },
  image:{
    width:70,
    height:70,
    borderRadius:10,
    backgroundColor:'#DDD'
  },
  info:{
    marginLeft:15,
    justifyContent:'center'
  },
  title:{
    fontWeight:'600'
  },
  subtitle:{
    color:'#666',
    marginTop:4
  }
});