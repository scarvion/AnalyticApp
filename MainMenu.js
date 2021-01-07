import React, { Component } from 'react';
import { View, Text,Button,TextInput,StyleSheet,FlatList,TouchableOpacity ,Image} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0083d6',
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
    Budget:{
      fontSize: 40,
      color: 'white',
    },
    BudgetBorder: {
      height: '30%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0083d6',
    },
    options: {
      height: '10%',
      width: '100%',
      fontSize: 30,
      color: 'white',
      backgroundColor: 'red',
      
    },
    flat: {
      flex: 1,
      width: "100%"

  },
  item: {
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 70,
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

export default class MainMenu extends Component {

    constructor(props)
    {
        super(props);
        const { navigation } = this.props;
        this.state = {
            email: null,
            UserEmailId: null,
            Balance: '0',
            DATA: [],
            EditBalance: false,
            loaded: false,
            UpdateBudget: false,
        };
        this.state.email = (navigation.getParam('email'));
        this.state.UserEmailId = this.state.email.toLowerCase();
        var temp = this.remove_character('@', this.state.UserEmailId);
        this.state.UserEmailId = temp.replace(/\./g, '');
    }

    remove_character(str_to_remove, str) {
      let reg = new RegExp(str_to_remove)
      return str.replace(reg, '')
    }

    componentDidUpdate () {
      const { navigation } = this.props;
      //sconsole.log("yoyo");
      this.state.UpdateBudget= (navigation.getParam('Update'));
      if(this.state.UpdateBudget == true)
      {
        firebase.database().ref('users/'+this.state.UserEmailId).once('value', function (snapshot) {
         

          this.setState({Balance: snapshot.val().Budget})
          
         

        }.bind(this)).then(() => {
          console.log("balance is " + this.state.Balance);
          this.props.navigation.setParams({Update: false});
        });

      }

    }
   

    handleInputText = (typedText) => {
        this.setState({ input: typedText});
      }
      UpdateBudget = () =>{
        firebase.database().ref('users/'+this.state.UserEmailId).update(
          {
              Budget: this.state.Balance,
          }
       )
      }
      goToExpenses = () => {
        const {navigation} = this.props;
       //navigation.navigate('Storage');
       navigation.navigate('ExpenseSummary',{ UserEmailId: this.state.UserEmailId });
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

        firebase.database().ref('users/'+this.state.UserEmailId).once('value', function (snapshot) {
         

            this.setState({Balance: snapshot.val().Budget})
            
           

    }.bind(this)).then(() => {
      this.setState({loaded: true});
    });
    
    //Get Expenses
    firebase.database().ref('users/'+this.state.UserEmailId+'/expenses').once('value', function (snapshot) {
        Array1 = [];
        snapshot.forEach(function (child) {
            expense = {
                type: child.val().type,
                name: child.val().name,
                amount: child.val().amount,
                date: child.val().date,
                time: child.val().time,
              };
              Array1.push(expense);
        })

        }.bind(this)).then(() => {
            this.setState({DATA: Array1});
            
        });

        
    }

    handleInputText = (typedText) => {
      this.setState({ Balance: typedText});
    }

    render(){

      if(this.state.loaded == false)
      {
        return null;
      }

      const {navigation} = this.props;
    return (
        <View style={{alignItems: 'center', flex: 1,backgroundColor: '#0083d6'}}>
          <View style={styles.BudgetBorder}>
          <Image style={{resizeMode: 'contain',width: '70%',height:'70%'}}
            source={require('./Images/EAZETitle.jpg')}/>
            <Text style={{color: 'white',fontSize: 20,fontFamily:'Apple Color Emoji'}}>Your balance : </Text>
            <View style={{flexDirection: 'row'}}>
              <Text  style={styles.Budget}>($)</Text>
            <TouchableOpacity>
             <TextInput style={styles.Budget} placeholder={'Amount'}
              onChangeText={this.handleInputText} value={this.state.Balance.toString()} 
              returnKeyType='done' keyboardType={'numeric'} onEndEditing={this.UpdateBudget}>
               </TextInput> 
            </TouchableOpacity>
            </View>
            <Text style={{color: 'white',fontSize: 20,fontFamily:'Apple Color Emoji'}}>tap to edit balance</Text>
            </View>
            <View style={{ flex: 1,flexDirection: 'row',marginTop: '100%'}}>
            <TouchableOpacity onPress={this.goToExpenses}>
            <Image style={{resizeMode:'contain',width: 100,height: 100}}
            source={require('./Images/ExpenseButton.jpg')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('BudgetAnalysis',{ UserEmailId: this.state.UserEmailId })}>
            <Image style={{resizeMode:'contain',width: 100,height:100}}
            source={require('./Images/AnalysisButton.jpg')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Track',{ UserEmailId: this.state.UserEmailId })}>
            <Image style={{resizeMode:'contain',width: 100,height:100}}
            source={require('./Images/TrackButton.jpg')}/>
            </TouchableOpacity>
            <TouchableOpacity>
            <Image style={{resizeMode:'contain',width: 100,height:100}}
            source={require('./Images/MeButton.jpg')}/>
            </TouchableOpacity>
            </View>

        </View>
    );
}


}