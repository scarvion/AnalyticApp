import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
    Button
  } from "react-native";
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import Constants from "expo-constants";
  import firebase from 'firebase';

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );


export default class BudgetAnalysis extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            UserEmailId: this.props.navigation.getParam('UserEmailId'),
            DATA: [],
            SortedData: [],
            Types: [],
            totalamount: 0,
            loading: true,
            FromDateDisplay:'',
            ToDateDisplay:'',
            SelectedDate: new Date(),
            ToSelectedDate: new Date(),
            visibility:false,
            visibility2:false
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
        this.getAllType();
      });
    }

    getAllType = () => {
      this.setState({loading: true});
      this.state.Types = [];
      this.state.totalamount =0;
      //Set from the earlist date to the last date
      var LatestYear=this.state.DATA[0].date2.getFullYear();
      var LatestMonth=this.state.DATA[0].date2.getMonth();
      var EarliestYear=this.state.DATA[this.state.DATA.length-1].date2.getFullYear();
      var EarliestMonth=this.state.DATA[this.state.DATA.length-1].date2.getMonth();
      if(this.state.FromDateDisplay == '')
      {
        this.state.FromDateDisplay = EarliestYear+"-"+(EarliestMonth+1)+"-"+this.state.DATA[this.state.DATA.length-1].date2.getDate();
        this.state.SelectedDate = this.state.DATA[this.state.DATA.length-1].date2;

        this.state.ToDateDisplay = LatestYear+"-"+(LatestMonth+1)+"-"+this.state.DATA[0].date2.getDate();
        this.state.ToSelectedDate = this.state.DATA[0].date2;
      }

        for(var i=0; i < this.state.DATA.length;i++)
        {
          if(this.state.DATA[i].date2 >= this.state.SelectedDate && this.state.DATA[i].date2 <= this.state.ToSelectedDate)
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
   

    get_Month(month) {
        if (month == 0)
            return 'January';
        else if (month == 1)
            return 'Febuary';
        else if (month == 2)
            return 'March';
        else if (month == 3)
            return 'April';
        else if (month == 4)
            return 'May';
        else if (month == 5)
            return 'June';
        else if (month == 6)
            return 'July';
        else if (month == 7)
            return 'August';
        else if (month == 8)
            return 'September';
        else if (month == 9)
            return 'October';
        else if (month == 10)
            return 'November';
        else
            return 'December';
    }



    SortAllExpenses = () =>{
        this.state.DATA = this.state.DATA.sort((a,b)=> b.date2 - a.date2);
        
    }

    handleConfirm=(date) => {
      this.state.SelectedDate = date;
      this.setState({FromDateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
      this.setState({visibility:false})
      this.getAllType();
    }

    handleConfirm2=(date) => {
      this.state.ToSelectedDate = date;
      this.setState({ToDateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
      this.setState({visibility2:false})
      this.getAllType();
    }

    onPressCancel=()=>{
      this.setState({visibility:false})
    }

    showDatePicker=()=>{
      this.setState({visibility:true})
    }

    onPressCancel2=()=>{
      this.setState({visibility2:false})
    }

    showDatePicker2=()=>{
      this.setState({visibility2:true})
    }

    

  render() {
    const Item = ({ title }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
    const renderItem = ({ item }) => (
      <Item title={item.type+" : $"+item.amount+" - "+item.percent.toFixed(2)+"%"} />
    );

    if(this.state.loading)
        return null;

    return (
        <SafeAreaView style={styles.container}>
          <Image style={{resizeMode:'contain',width:'60%'}}
            source={require('./Images/Analysis.jpg')}/>
            <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> From :</Text>
               <Button color='white'title={this.state.FromDateDisplay} onPress={this.showDatePicker} />
              <DateTimePickerModal
              isVisible={this.state.visibility}
              mode="date"
              isDarkModeEnabled={true}
              onConfirm={this.handleConfirm}
              onCancel={this.onPressCancel}
              />  
              <Text style={{color: 'white' ,fontSize: 20,fontFamily:'Apple Color Emoji'}}> To :</Text>
               <Button color='white'title={this.state.ToDateDisplay} onPress={this.showDatePicker2} />
              <DateTimePickerModal
              isVisible={this.state.visibility2}
              mode="date"
              isDarkModeEnabled={true}
              onConfirm={this.handleConfirm2}
              onCancel={this.onPressCancel2}
              />  
               </View>
            <Text style={{padding:10, fontSize: 15,fontFamily:'Apple Color Emoji', color: 'white',backgroundColor: 'steelblue' }}>
                                        {"Total amount spent : "+this.state.totalamount }
                                    </Text>
            <FlatList
        data={this.state.Types}
        renderItem={renderItem}
        keyExtractor={item => item.type}
      />
       
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#0083d6',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  header: {
    color: 'white',
    fontSize: 32,
    backgroundColor: "#00c2b7"
  }
});