import React, { Component } from 'react';
import { View, Text,Button,Image,StyleSheet,TextInput,FlatList,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import Dialog from 'react-native-dialog';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';


const styles = StyleSheet.create({
 
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0083d6',
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 15,
    },
   
    MiddleBoxStyle: {
   
      marginTop:'5%',
      paddingTop:15,
      paddingBottom:15,
      marginLeft: '10%',
      marginRight:'10%',
      backgroundColor:'#00BCD4',
      borderRadius:20,
      borderWidth: 2,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: '20%'
    },
   
    TextStyle:{
        color:'#fff',
        textAlign:'center',
        fontSize: 12,
        fontFamily:'Apple Color Emoji'
    },
    ThresholdAmount:{
        fontSize: 20,
        color: 'white',
      },
   
  });


export default class Thresholds extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            UserEmailId: this.props.navigation.getParam('UserEmailId'),
            DATA: [],
            Types: [],
            refresh: false,
            dialogVisible: false,
            ThresholdAmt: '',
            CurrentType: '',
            CurrentAmt: 0,
            StartDateDisplay:'hi',
            SelectedStartDate: new Date(),
            ToDateDisplay:'yo',
            ToDate: new Date(),
            visibility:false,
            Frequency:'Daily',
            totalamount: 0
        };

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

        firebase.database().ref('users/'+this.state.UserEmailId+'/expenses').once('value', function (snapshot) {
         
                
            snapshot.forEach(element => {
                var data = {amount: '', date: '',name: '',time: '',type: '',date2: ''};
                element.forEach(stuff => {
                    if(stuff.key == 'amount')
                    {
                        
                        data.amount = stuff.val();
                    }
                    if(stuff.key == 'date')
                    {
                        data.date = stuff.val();
                        data.date2 = new Date(stuff.val());
                    }
                    if(stuff.key == 'name')
                    {
                        data.name = stuff.val();
                    }
                    if(stuff.key == 'time')
                    {
                        data.time = stuff.val();
                        var timesplit = stuff.val().split(":");
                        data.date2.setHours(timesplit[0]);
                        data.date2.setMinutes(timesplit[1]);
                        data.date2.setSeconds(timesplit[2]);
                    }
                    if(stuff.key == 'type')
                    {
                        data.type = stuff.val();
                    }
                });
                this.state.DATA.push(data);
            });
          
         

  }.bind(this)).then(() => {
    //sorting expenses by date and time
    this.SortAllExpenses();

  });

    firebase.database().ref('users/'+this.state.UserEmailId+'/Track').once('value', function (snapshot) {
         
        snapshot.forEach(element => {

                if(element.key == 'ThresholdAmt')
                {
                   this.state.ThresholdAmt = element.val();
                }
                if(element.key == 'StartDate')
                {
                    this.state.SelectedStartDate = new Date(element.val());
                }
                if(element.key == 'Frequency')
                {
                    this.state.Frequency = element.val();
                }
                if(element.key == 'NotifyMe')
                {

                }
                if(element.key == 'NotificationFrequency')
                {

                }
            
            });
        
       

        }.bind(this)).then(() => {
            this.getDate(this.state.SelectedStartDate);
            this.getAllType();
            this.setState({loading:false});

        });
        
}

SortAllExpenses = () =>{
    this.state.DATA = this.state.DATA.sort((a,b)=> b.date2 - a.date2);
    
}

getToDate = () => {
  if(this.state.Frequency == 'Monthly')
  {
  var numberOfDays = new Date(this.state.SelectedStartDate.getFullYear(),this.state.SelectedStartDate.getMonth()+1,0).getDate();
  this.state.ToDate = new Date(this.state.SelectedStartDate.getFullYear(),this.state.SelectedStartDate.getMonth(),numberOfDays);
  this.state.ToDateDisplay =  this.state.SelectedStartDate.getFullYear()+'-'+(this.state.SelectedStartDate.getMonth()+1)+'-'+numberOfDays;
  }
  else if(this.state.Frequency == 'Yearly')
  {
    var numberOfDays = new Date(this.state.SelectedStartDate.getFullYear(),12,0).getDate();
    this.state.ToDate = new Date(this.state.SelectedStartDate.getFullYear(),11,numberOfDays);
    this.state.ToDateDisplay =  this.state.ToDate.getFullYear()+'-'+(this.state.ToDate.getMonth()+1)+'-'+this.state.ToDate.getDate();
  }

}

getAllType = () => {
  this.setState({loading: true});
  this.state.Types = [];
  this.state.totalamount =0;
 
  this.getToDate();

    for(var i=0; i < this.state.DATA.length;i++)
    {
      if(this.state.DATA[i].date2 >= this.state.SelectedStartDate && this.state.DATA[i].date2 <= this.state.ToDate)
      {
      this.state.totalamount += parseInt(this.state.DATA[i].amount);
      found = false;
      for(var j=0; j < this.state.Types.length;j++)
      {
        if(this.state.DATA[i].type == this.state.Types[j].type)
        {
          
          found = true;
          break;
        }
      }
      if(found == false)
      {
        var data = {type:this.state.DATA[i].type,amount: this.state.DATA[i].amount,percent: 0};
        this.state.Types.push(data);
      }
      else
      {
        var a = parseInt(this.state.Types[j].amount) + parseInt(this.state.DATA[i].amount);
        this.state.Types[j].amount = a;
      }
    }

    }

    for(var i =0; i < this.state.Types.length;i++)
    {

      this.state.Types[i].percent = (parseInt(this.state.Types[i].amount)/this.state.totalamount)*100;
    }
    this.setState({loading: false});

}

    handleInput = (typedText) => {
        this.setState({ ThresholdAmt: typedText });
    }

    UpdateThreshold = () =>{
        firebase.database().ref('users/'+this.state.UserEmailId+'/Track').update(
          {
              ThresholdAmt: this.state.ThresholdAmt,
          }
       )
      }
      UpdateStartDate = () =>{
        firebase.database().ref('users/'+this.state.UserEmailId+'/Track').update(
          {
              StartDate: this.state.SelectedStartDate,
          }
       ).then(() => {
        this.getAllType();

    });
      }
      UpdateFrequency =(Frequency)=>
      {
          this.state.Frequency = Frequency;
        firebase.database().ref('users/'+this.state.UserEmailId+'/Track').update(
            {
                Frequency: this.state.Frequency,
            }
         ).then(() => {
          this.getAllType();
  
      });
         
      }

      getDate = (date) => {
        var month = date.getMonth() + 1; //Current Month
          var year = date.getFullYear(); //Current Year
          var day = date.getDate();
        if(day < 10)
        {
          day = '0'+ day;
        }
        if(month < 10)
        {
          month = '0'+ month;
        }
          this.state.StartDateDisplay =  year+'-'+month+'-'+day;
      }

      onPressCancel=()=>{
        this.setState({visibility:false})
      }
  
      showDatePicker=()=>{
        this.setState({visibility:true})
      }
      handleConfirm=(date) => {
        this.state.SelectedStartDate = date;
        this.setState({StartDateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
        this.UpdateStartDate();
        this.setState({visibility:false})
      }

render(){

    if(this.state.loading == true)
      {
        return null;
      }

      const Item = ({ title }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );
      const renderItem = ({ item }) => (
        <Item title={item.type+" : $"+item.amount+" - "+item.percent.toFixed(2)+"%"} />
      );

        return (
           <View style={styles.MainContainer}>
               <Image style={{resizeMode:'contain',width: '60%',height: 50}}
            source={require('./Images/TrackTitle.jpg')} />
               <View style={styles.MiddleBoxStyle}>
                <Text style={styles.TextStyle}>Welcome to the Threshold Screen{'\n'}
                This function sets reminders for you if you're exceeding your budget</Text>
                <TouchableOpacity style={{ flexDirection: 'row'}}>
                <Text  style={styles.ThresholdAmount}>($)</Text>
                <TextInput style={styles.ThresholdAmount} placeholder={'Set threshold amount'}
              onChangeText={this.handleInput} value={this.state.ThresholdAmt.toString()} 
              returnKeyType='done' keyboardType={'numeric'} onEndEditing={this.UpdateThreshold}>
               </TextInput> 
               </TouchableOpacity>
               <Text style={styles.TextStyle}>tap here to edit</Text>
               </View>
               <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'white' ,fontSize: 15,fontFamily:'Apple Color Emoji'}}> Starting From :</Text>
               <Button color='white'title={this.state.StartDateDisplay} onPress={this.showDatePicker} />
              <DateTimePickerModal
              isVisible={this.state.visibility}
              mode="date"
              isDarkModeEnabled={true}
              onConfirm={this.handleConfirm}
              onCancel={this.onPressCancel}
              />  
              </View>
              <Text style={{color: 'white' ,fontSize: 15,fontFamily:'Apple Color Emoji',letterSpacing: -1}}> To : {this.state.ToDateDisplay}</Text>
              <View style={{zIndex:999,flexDirection: 'row'}}>
              <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> Frequency:</Text>
              <DropDownPicker
                items={[
                {label: 'Monthly', value: 'Monthly'},
                {label: 'Yearly', value: 'Yearly'},
                ]}
                defaultValue={this.state.Frequency}
                containerStyle={{height: 40,width:100}}
                style={{backgroundColor: '#fafafa'}}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item => this.UpdateFrequency(item.value)}
            />
        </View>
               <Text style={{padding:10, fontSize: 15,fontFamily:'Apple Color Emoji', color: 'white',backgroundColor: 'steelblue' }}>
                                        {"Total amount spent : ($)"+this.state.totalamount+ '- '+((this.state.totalamount/this.state.ThresholdAmt)*100).toFixed(2)+'%'}
                                    </Text>
             <FlatList
              data={this.state.Types}
              renderItem={renderItem}
              keyExtractor={item => item.type}
              />
              
         </View>
        );
    }
}