import React, { Component } from 'react';
import { ScrollView, Animated, Dimensions, Keyboard, UIManager, Alert, StyleSheet, TextInput, Text, View, Image, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import EazeLogo from './Images/EAZETitle.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
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
    width: '80%',
    marginBottom: 15,
    marginTop: 20,
    resizeMode: 'contain'
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
const { State: TextInputState } = TextInput;
export default class CreateAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      Hp: null,
      Pw: null,
      VerifyPw: null
    };
    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(styles.logo.height);

  }
  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }


  handleNameText = (typedText) => {
    this.setState({ name: typedText});
  }
  handleEmailText = (typedText) => {
    this.setState({ email: typedText });
  }
  handleHpText = (typedText) => {
    this.setState({ Hp: typedText });
  }
  handlePwText = (typedText) => {
    this.setState({ Pw: typedText });
  }
  handleVerifyPwText = (typedText) => {
    this.setState({ VerifyPw: typedText });
  }
  remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
  }


  VerifyEmail = () => {

    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(() => {
      // Email sent.

    }).catch(function (error) {
      // An error happened.
    });

  }

  
  handleSubmit = (event) => {
    // boolean to check if all fields are valid
    var Valid = true;
    var sentence = "";
    if (this.state.name == null || this.state.Hp == null || this.state.email == null
      || this.state.Pw == null || this.state.VerifyPw == null || this.state.name == ''
      || this.state.Hp == '' || this.state.email == '' || this.state.Pw == ''
      || this.state.VerifyPw == '') {

      if (this.state.name == null || this.state.name == '')
        sentence += "Name not filled\n";
      if (this.state.Hp == null || this.state.Hp == '')
        sentence += "Phone Number not filled\n";
      if (this.state.email == null || this.state.email == '')
        sentence += "Email not filled\n";
      if (this.state.Pw == null || this.state.VerifyPw == null
        || this.state.Pw == '' || this.state.VerifyPw == '')
        sentence += "Password not filled\n";

      Valid = false;
    }
    if (this.state.Hp != null) {
      var numbers = /^\d+$/.test(this.state.Hp);
      if (!numbers) {
        Valid = false;
        sentence += 'Please Input a valid phone number!\n';
      }
    }
    if (this.state.Pw != null && this.state.VerifyPw != null && this.state.Pw != this.state.VerifyPw) {
      sentence += 'Password Mismatch!\n';
      Valid = false;
    }
    else if (this.state.Pw != null && this.state.Pw.length < 6) {
      sentence += 'Password length must be a minimum of 6\n';
      Valid = false;
    }

    if (Valid) {
      var tempEmail = this.state.email;
      var name = this.state.name;
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.Pw).then(function (result) {
        result.user.updateProfile({
          name: name
        })
        // this is to prevent double account creation in database as lower case letters are not detected
        this.state.email = this.state.email.toLowerCase();
        var temp = this.remove_character('@', this.state.email);
        var userEmail = temp.replace(/\./g, '');


        firebase.database().ref('users/' + userEmail).once('value', function (snapshot) {
          var exists = (snapshot.val() !== null);
          if (!exists) {
            this.VerifyEmail();
            firebase.database().ref('users/' + userEmail).set(
              {
                phone: this.state.Hp,
                name: this.state.name,
                Budget: 0
              }
            ).then(() => {
              Alert.alert('Account Created', 'An email as been sent to your email account for verification', [
                { text: 'OK', onPress: () => this.props.navigation.navigate('UserLogin') }
              ]);
            }).catch((error) => {

            });
          }

        }.bind(this));

      }.bind(this)).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage == 'The email address is already in use by another account.') {
          Alert.alert('Account Exists', 'Email: ' + tempEmail + ' already exists');
          // this is to ensure database do not add mroe than 1 account details
          Valid = false;
        }

        if (errorCode == 'auth/invalid-email') {
          Alert.alert('Invalid Email', 'Please enter a valid email');
          Valid = false;
        }
      });

    }
    else
      Alert.alert('Invalid Input', sentence);

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

  keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: styles.logo.height/2,
      }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: styles.logo.height,
      }),
    ]).start();
  };

  render() {
    const { shift } = this.state;
    return (
      <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
        <Animated.Image source={EazeLogo} style={[styles.logo, { height: this.imageHeight }]} />
            <Text style={{ fontSize: 30, marginBottom: 15 }}>Create New Account</Text>
            <TextInput style={styles.input} placeholder={'Full Name'}
              onChangeText={this.handleNameText} value={this.state.name}></TextInput>
            <TextInput style={styles.input} placeholder={'E-mail'}
              onChangeText={this.handleEmailText} autoCapitalize='none' value={this.state.email}></TextInput>
            <TextInput returnKeyType='done' keyboardType={'numeric'} style={styles.input} placeholder={'Phone Number'}
              onChangeText={this.handleHpText} value={this.state.Hp} returnKeyType='done' keyboardType={'numeric'}></TextInput>
            <TextInput style={styles.input} placeholder={'Password'} secureTextEntry={true}
              onChangeText={this.handlePwText} value={this.state.Pw} />
            <TextInput style={styles.input} placeholder={'Verify Password'} secureTextEntry={true}
              onChangeText={this.handleVerifyPwText} value={this.state.VerifyPw} />
            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
              <Text style={{ fontSize: 16, color: 'white' }}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('UserLogin')}>
              <Text style={{ fontSize: 16, color: 'white' }}>Back</Text>
            </TouchableOpacity>
            </Animated.View>

    );
  }
  

}