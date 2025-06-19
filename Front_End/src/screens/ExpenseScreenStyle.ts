import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
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
    }
);
export default styles;