import React, { Component } from 'react';
import { View, Text,Button,TextInput,StyleSheet } from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: "100%"
    },
    input: {
      width: 200,
      height: 45,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15
    },
    logo: {
      height: 150,
      width: 150,
      marginBottom: 15,
    },
    flat: {
      flex: 1,
      width: "100%"

  },
  item: {
      alignItems: 'stretch',
      justifyContent: 'center',
      height: 50,
      width: 200,

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

export default class Home extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            input: '',
        };
    }
    GotoMainScreen = () => {
        const {navigation} = this.props;
        firebase.database().ref('users/001').update(
            {
                Budget: this.state.input,
            }
         )

        navigation.navigate('MainMenu');
    }


    handleInputText = (typedText) => {
        this.setState({ input: typedText});
      }

      UNSAFE_componentWillMount() {
        var config = {
            apiKey: "AIzaSyBqd9SnARS_h_yIwrg0t7rWQa3Qs5FHWeE",
            authDomain: "testdata-ac3a8.firebaseapp.com",
            databaseURL: "https://testdata-ac3a8.firebaseio.com",
            projectId: "testdata-ac3a8",
            storageBucket: "testdata-ac3a8.appspot.com",
            messagingSenderId: "702340369964",
            appId: "1:702340369964:web:06999f652786d083e60b89",
            measurementId: "G-T618Y4WNH7"
          };
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        
    }

    render(){
        
    return (
        <View style={{alignItems: 'center', flex: 1,justifyContent: 'center'}}>
            <Text>Welcome to the Eaze</Text>
            <Text>Key in your current account balance</Text>
            <TextInput style={styles.input} placeholder={'($)Amount'}
              onChangeText={this.handleInputText} value={this.state.input} returnKeyType='done' keyboardType={'numeric'}/>
            <Button title="Go to Storage" onPress={this.GotoMainScreen}/>

        </View>
    );
}


}