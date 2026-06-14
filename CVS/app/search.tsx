import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search</Text>

      <TextInput
        placeholder="Search for products..."
        style={styles.search}
      />

      <Text style={styles.section}>
        Popular Categories
      </Text>

      <View style={styles.grid}>
        {[
          'Shoes',
          'Bags',
          'Watches',
          'Furniture',
          'Electronics',
          'Sunglasses',
        ].map(item => (
          <View key={item} style={styles.category}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,backgroundColor:'#F8F9FB'},
  header:{fontSize:30,fontWeight:'700',marginTop:50},
  search:{
    backgroundColor:'white',
    borderRadius:15,
    padding:15,
    marginTop:20
  },
  section:{
    marginTop:25,
    fontWeight:'600'
  },
  grid:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:15
  },
  category:{
    width:'30%',
    height:80,
    backgroundColor:'white',
    margin:5,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center'
  }
});