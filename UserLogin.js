import React, { Component }from 'react';
import { Animated, Dimensions, Keyboard, UIManager, Alert, StyleSheet, TextInput, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

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
    width: '80%',
    height: 200,
    marginBottom: 15,
    resizeMode: 'contain'
  },
  forget: {
    marginBottom: 15,
    color: 'blue',
    textDecorationLine: 'underline',
    alignItems: 'center',
  },
  loginFooter: {
    marginTop: 25
  },
  button: {
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#2990cc'
  }
});

const { State: TextInputState } = TextInput;

export default class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
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

  onLogin() {
    const { email, password } = this.state;
    Alert.alert('Credentials', `Username = ${email}\nPassword = ${password}`);
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

  handleLogin = (event) => {
    if (this.state.email != null && this.state.password != null) {
      this.state.email = this.state.email.toLowerCase();
       
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function () {
        var user = firebase.auth().currentUser;
        // if user is verified then log him in
        if (user.emailVerified) {
          this.props.navigation.navigate('MainMenu', { email: this.state.email });
      
        }
        else {
          Alert.alert('Account un-verified', 'An Email has been sent to your email for verification');
          this.VerifyEmail();
          firebase.auth().signOut().then(function () {
            // signed out
          }, function (error) {
            console.error('Sign Out Error', error);
          });
        }

      }.bind(this)).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage == 'The password is invalid or the user does not have a password.') {
          Alert.alert('Invalid Input', 'Invalid Username and/or Password');
        }
        else if (errorMessage == 'Too many unsuccessful login attempts. Please try again later.') {
          Alert.alert('Too many unsuccessful login attempts.', 'Please try again later.');
        }
        else {
          Alert.alert('Invalid Input', 'Invalid Username and/or Password');
        }


  });


    }
    else
      Alert.alert('Invalid Input', 'Key in a Username and Password');
      

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
      <Animated.Image source={require('./Images/EAZETitle.jpg')} style={[styles.logo, { height: this.imageHeight }]} />
          <Text style={{ fontSize: 28, marginBottom: 25 }}>WELCOME</Text>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            autoCapitalize='none'
            style={styles.input} />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input} />
          <Text style={styles.forget} onPress={() => this.props.navigation.navigate('Forgot')}>Forget Password?</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{ fontSize: 16, color: 'white' }}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.loginFooter} >Don't have an account yet?</Text>
          <Text style={styles.loginFooter, { color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => this.props.navigation.navigate('CreateAccount')}>Create new account</Text>
        </Animated.View>

    );
  }

}
