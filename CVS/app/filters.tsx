import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FiltersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filters</Text>

      <Text style={styles.label}>Categories</Text>

      <View style={styles.tags}>
        {['All','Shoes','Bags','Watches','Furniture'].map(item => (
          <View key={item} style={styles.tag}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>
        Price Range
      </Text>

      <View style={styles.sliderPlaceholder} />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>
          Apply Filters
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,backgroundColor:'#F8F9FB'},
  header:{fontSize:30,fontWeight:'700',marginTop:50},
  label:{marginTop:25,fontWeight:'600'},
  tags:{flexDirection:'row',flexWrap:'wrap'},
  tag:{
    backgroundColor:'white',
    padding:10,
    borderRadius:20,
    margin:5
  },
  sliderPlaceholder:{
    height:8,
    backgroundColor:'#7C3AED',
    borderRadius:4,
    marginTop:25
  },
  button:{
    marginTop:50,
    backgroundColor:'#7C3AED',
    padding:16,
    borderRadius:15
  },
  buttonText:{
    color:'white',
    textAlign:'center',
    fontWeight:'600'
  }
});