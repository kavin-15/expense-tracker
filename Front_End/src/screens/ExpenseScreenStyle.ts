import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 8,
  marginBottom: 12,
  fontSize: 14,
  backgroundColor: '#fff',
},

  container: {
    padding: 16,
    backgroundColor: '#fff',},
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#fff'
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    description:{
        fontSize:16,
        fontWeight: '500',
        color: '#333',
    },
    amount:{
        fontSize:12,
        fontWeight:'bold',
        color:'#2e86de',
    },
    meta:{
        fontSize: 12,
        color: '#888',
    },
    filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
    },
    filterOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
    color: '#333',
    },
    activeFilter: {
    backgroundColor: '#2e86de',
    color: '#fff',
    fontWeight: 'bold',
    },
    }
);
export default styles;