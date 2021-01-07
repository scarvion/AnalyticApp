import React, { Component , useState  } from 'react';
import { View, Text,Button,Image,Alert,TextInput,FlatList,StyleSheet,TouchableOpacity,Animated,Keyboard,Dimensions,UIManager} from 'react-native';
import firebase from 'firebase';
import { getPlaneDetection } from 'expo/build/AR';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0083d6',
      width: "100%"
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


  const { State: TextInputState } = TextInput;
export default class Storage extends Component {

    constructor(props)
    {
        super(props);
        const { navigation } = this.props;
        this.state = {
          UserEmailId: null,
          Category:'',
            Merchant: '',
            amount: 0,
            Budget: '',
            DATA: [],
            counter: 0,
            shift: new Animated.Value(0),
            visibility:false,
            DateDisplay:''
        };
        this.getTodayDate();
        this.keyboardHeight = new Animated.Value(0);
        this.state.UserEmailId = (navigation.getParam('UserEmailId'));

    }

    componentWillMount() {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
  
    componentWillUnmount() {
      this.keyboardWillShowSub.remove();
      this.keyboardWillHideSub.remove();
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
         

              this.setState({Budget: snapshot.val().Budget})
              
             

      }.bind(this)).then(() => {
          

      });
    }
    handleCategoryText = (typedText) => {
      this.setState({ Category: typedText});
    }

    handleDateText = (typedText) => {
      this.setState({ Date: typedText});
    }

    handleMerchantText = (typedText) => {
        this.setState({ Merchant: typedText});
      }
      handleAmountText = (typedText) => {
        this.setState({ amount: typedText});
      }
      AddExpense = () => {
       
        expense = {
          type: this.state.Category,
          name: this.state.Merchant,
          amount: this.state.amount,
          date: this.state.DateDisplay,
          index: this.state.counter,
        };
        var found = false;
        for(var i =0; i < this.state.DATA.length;i++)
        {
          if(this.state.DATA[i].type == expense.type && this.state.DATA[i].name == expense.name
            && this.state.DATA[i].date == expense.date)
            {
              found = true;
              this.state.DATA[i].amount = this.state.DATA[i].amount*1 + expense.amount*1;
              break;
            }
        }
        if(found == false)
        {
          this.state.DATA.push(expense);
        }
        var count = this.state.counter + 1;
        this.setState({counter: count});
      }
      ConfirmRemoveExpense = (item) => {
        for(var i =0; i < this.state.DATA.length;i++)
        {
          if(this.state.DATA[i].type == item.type && this.state.DATA[i].name == item.name
            && this.state.DATA[i].date == item.date)
            {
              this.state.DATA.splice(i,1);
              this.setState({counter: this.state.counter-1});
              break;
            }
        }
      }

      getListViewItem = (item) => {

        Alert.alert(
          'Remove Expense?',
          "Category : " + item.type + "\n" 
                                        + "Expense : " + item.name + "\n" 
                                        + "amount : $" + item.amount + "\n"
                                        + "Date : " + item.date,
          [
              { text: 'Yes', onPress: () => this.ConfirmRemoveExpense(item) },
              {
                  text: 'No',
                  style: 'cancel',
              },

          ],
          { cancelable: false },
      );
    }
    getTodayDate = () => {
      var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var day = new Date().getDate();
      if(day < 10)
      {
        day = '0'+ day;
      }
      if(month < 10)
      {
        month = '0'+ month;
      }
        this.state.DateDisplay =  year+'-'+month+'-'+day;
    }

    get_Month(month) {
      if (month == 1)
          return 'January';
      else if (month == 2)
          return 'Febuary';
      else if (month == 3)
          return 'March';
      else if (month == 4)
          return 'April';
      else if (month == 5)
          return 'May';
      else if (month == 6)
          return 'June';
      else if (month == 7)
          return 'July';
      else if (month == 8)
          return 'August';
      else if (month == 9)
          return 'September';
      else if (month == 10)
          return 'October';
      else if (month == 11)
          return 'November';
      else
          return 'December';
  }
  removeDelimeter = (date,deli) =>
  {
    temp = "";
    for(i =0; i <date.length;i++)
    {
      if(date[i] != deli)
      {
        temp+= date[i];
      }
    }
    return temp;
  }

    SubmitExpense = () => {
      var time= new Date().getHours() +':' + new Date().getMinutes()+ ':' + new Date().getSeconds();
      for(i =0; i < this.state.DATA.length;i++)
      {
        this.state.Budget -= this.state.DATA[i].amount
        var transactionName = this.state.DATA[i].type + this.state.DATA[i].name 
        + this.state.DATA[i].amount + this.state.DATA[i].date + time;
       firebase.database().ref('users/'+this.state.UserEmailId+'/expenses/'+transactionName).set(
          {
            type: this.state.DATA[i].type,
            name: this.state.DATA[i].name,
            amount: this.state.DATA[i].amount,
            date: this.state.DATA[i].date,
            time: time,
            
          }
        ).then(() => {
          
        }).catch((error) => {

        });
      }
      firebase.database().ref('users/'+this.state.UserEmailId).update(
        {
            Budget: this.state.Budget,
        }
     )
      const { navigation } = this.props;
      navigation.navigate('AddexpSummary',{Data: this.state.DATA, UserEmailId: this.state.UserEmailId});
    }

    handleConfirm=(date) => {
      console.log(date.getMonth()+1);
      console.log(date.getDate());
      console.log(date.getFullYear());
      this.setState({DateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
      this.setState({visibility:false})
    }

    onPressCancel=()=>{
      this.setState({visibility:false})
    }

    showDatePicker=()=>{
      this.setState({visibility:true})
    }

    keyboardWillShow = (event) => {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: event.endCoordinates.height,
        }),
      ]).start();
    };
  
    keyboardWillHide = (event) => {
      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: 0,
        }),
      ]).start();
    };


render(){

        const { shift } = this.state;

        return (
          
          <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
               <View style={{height: '50%',width: '100%',borderBottomColor: 'white',borderBottomWidth: 2}}>
             <FlatList 
                    bounces={true}
                    data={this.state.DATA}
                    renderItem={({ item }) =>
                        
                            <TouchableOpacity style={styles.item}
                                onPress={this.getListViewItem.bind(this, item)}>
                                    <Text style={{padding:10, fontSize: 15,fontFamily:'Apple Color Emoji', color: 'white',backgroundColor: 'steelblue' }}>
                                        {"Category : " + item.type + "\n" 
                                        + "Expense : " + item.name + "\n" 
                                        + "amount : $" + item.amount + "\n"
                                        + "Date : " + item.date}
                                    </Text>
                            </TouchableOpacity>
                    } keyExtractor={(item,index) => item + index}
                />
                </View>
                <ScrollView style={{width: '100%',backgroundColor: "#00c2b7"}} overScrollMode='never' showsVerticalScrollIndicator={false}>
                  <View style={{alignItems: 'center'}}>
               <Text style={{color: 'white',padding: 10,fontSize: 20,fontFamily:'Apple Color Emoji'}}>Number of Expenses: {this.state.DATA.length}</Text>
               <View style={{flexDirection: 'row'}}>
               <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> Expense type :</Text>
               <TextInput style={styles.input} placeholder={'Expense Category'} placeholderTextColor='white'
              onChangeText={this.handleCategoryText} value={this.state.Category}/>
              </View>
              <View style={{flexDirection: 'row'}}>
               <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> Expense name :</Text>
               <TextInput style={styles.input} placeholder={'Merchant Name'} placeholderTextColor='white'
              onChangeText={this.handleMerchantText} value={this.state.Merchant}/>
              </View>
              <View style={{flexDirection: 'row'}}>
               <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> Amount spent :</Text>
              <TextInput style={styles.input} placeholder={'Amount($)'} placeholderTextColor='white'
              onChangeText={this.handleAmountText} value={this.state.amount} returnKeyType='done' keyboardType={'numeric'}/>
              </View>
              <View style={{flexDirection: 'row'}}>
               <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> Date      :</Text>
               <Button color='white'title={this.state.DateDisplay} onPress={this.showDatePicker} />
              <DateTimePickerModal
              isVisible={this.state.visibility}
              mode="date"
              isDarkModeEnabled={true}
              onConfirm={this.handleConfirm}
              onCancel={this.onPressCancel}
              />  
               </View>
               
               <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={this.AddExpense}>
                <Image style={{resizeMode:'contain',width: 200,height:100}}
            source={require('./Images/AddTransactionButton.jpg')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.SubmitExpense}>
                <Image style={{resizeMode:'contain',width: 200,height:100}}
            source={require('./Images/SubmitExpensesButton.jpg')}/>
                </TouchableOpacity>

              </View>
              </View>
             
              </ScrollView>
              </Animated.View>
        );
    }

}