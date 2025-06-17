import React from 'react';
import { View, Text, StyleSheet, Button}  from 'react-native';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Home: undefined;
    About: undefined;
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return(
        <View style ={style.container}>
            <Text style={style.title}>Welcome to Expense Tracker!</Text>
            <Button
                title="Go to About"
                onPress={() => navigation.navigate('About')}
            />
        </View>
    );
};const style = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        backgroundColor: '#fff'
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default HomeScreen;
/>/;
