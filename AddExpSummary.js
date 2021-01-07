import React, { Component } from 'react';
import { View, Text,Button,Image,Alert,TextInput,FlatList,StyleSheet,TouchableOpacity,Animated,Keyboard,Dimensions,UIManager} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0083d6'
    },
    input: {
      width: 180,
      height: 45,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      borderColor: 'white',
      color: 'white',
      backgroundColor: '#0083d6'
    },
    item: {
      borderColor: 'white',
      borderWidth: 5,


  },
    button: {
      width: 180,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: '#2990cc',
      marginBottom: 15,
    }
  });


export default class ExpenseSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserEmailId: this.props.navigation.getParam('UserEmailId'),
            DATA: this.props.navigation.getParam('Data'),
        };


    }

render(){
        const { navigation } = this.props;
        
        return (
           <View style={styles.container}>
               <Image style={{resizeMode: 'contain',width: '70%'}}
            source={require('./Images/Summary.jpg')}/>
               <View style={{height: '50%',width: '100%',borderBottomColor: 'white',borderBottomWidth: 2}}>
             <FlatList 
                    bounces={true}
                    data={this.state.DATA}
                    renderItem={({ item }) =>
                        
                            <View style={styles.item}>
                                    <Text style={{padding:10, fontSize: 15,fontFamily:'Apple Color Emoji', color: 'white',backgroundColor: 'steelblue' }}>
                                        {"Category : " + item.type + "\n" 
                                        + "Expense : " + item.name + "\n" 
                                        + "amount : $" + item.amount + "\n"
                                        + "Date : " + item.date}
                                    </Text>
                            </View>
                    } keyExtractor={(item,index) => item + index}
                />
                </View>
                <TouchableOpacity onPress={()=> navigation.navigate('MainMenu',{Update: true})}>
                <Image style={{resizeMode:'contain',marginTop:'5%',width: 400,height:100}}
            source={require('./Images/DoneButton.jpg')}/>
                </TouchableOpacity>

         </View>
        );
    }
}