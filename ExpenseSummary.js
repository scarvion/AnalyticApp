import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList,
    Image,
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


export default class ExpenseSummary extends React.Component {

    constructor(props)
    {
        super(props);
        const { navigation } = this.props;
        this.state = {
            UserEmailId: null,
            DATA: [],
            SortedData: [],
            loading: true,
            FromDateDisplay:'',
            ToDateDisplay:'',
            SelectedDate: new Date(),
            ToSelectedDate: new Date(),
            visibility:false,
            visibility2:false
        };
        this.state.UserEmailId = (navigation.getParam('UserEmailId'));
        console.log(this.state.UserEmailId);
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
        if(this.state.DATA.length > 0)
        {
        this.SortAllExpenses();
        this.sortByMonthsYears();
        }
        else
        this.setState({loading: false});
      });
    }
    sortByMonthsYears()
    {
      this.setState({loading: true});
      this.state.SortedData = [];
      var Title=[];
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
      
      //Calculate amount of months between the latest and earliest date
      var amtOfMonths = 0;
      if(EarliestMonth > LatestMonth)
      amtOfMonths = ((LatestYear-EarliestYear)*12)+(EarliestMonth-LatestMonth);
      else
      amtOfMonths = ((LatestYear-EarliestYear)*12)+(LatestMonth-EarliestMonth);

      var CurrentMonth = EarliestMonth;
      var CurrentYear = EarliestYear;
      for(var i =0; i <= amtOfMonths;i++)
      {
        var CurrentData = [];
 
        for(var j =0; j < this.state.DATA.length;j++)
        {
          if(this.state.DATA[j].date2 >= this.state.SelectedDate && this.state.DATA[j].date2 <= this.state.ToSelectedDate)
          {
          if(this.state.DATA[j].date2.getMonth() == CurrentMonth && 
          this.state.DATA[j].date2.getFullYear() == CurrentYear)
          {
            
            CurrentData.push(this.state.DATA[j]);
          }
        }
        }
        if(CurrentData.length > 0)
        {
          var d = new Date();
          d.setFullYear(CurrentYear, CurrentMonth);
          this.state.SortedData.push({title: (this.get_Month(CurrentMonth)+ ' ' + CurrentYear), data: CurrentData,date: d});
        }
       
        if(CurrentMonth == 11)
        {
          CurrentYear +=1;
          CurrentMonth = 0;
        }
        else
        {
          CurrentMonth++;
        }
       
      }
      this.state.SortedData = this.state.SortedData.sort((a,b)=> b.date - a.date);
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

    ConfirmRemoveTransaction = (item) => {

      var transactionName = item.type + item.name+item.amount+item.date+item.time;
      console.log(transactionName);
      firebase.database().ref('users/'+this.state.UserEmailId+'/expenses/'+transactionName).remove().then(() => {
              this.setState({loading: false});
              this.setState({DATA: []});
              this.setState({SortedData: []});
              this.UNSAFE_componentWillMount();
          });


  }

  AlertRemoveTransaction = (item) => {
      Alert.alert(
          'Confirm Delete',
            'Transaction: ' + item.name,
          [
              { text: 'Yes', onPress: () => this.ConfirmRemoveTransaction(item) },
              {
                  text: 'No',
                  style: 'cancel',
              },

          ],
          { cancelable: false },
      );
  }


    SortAllExpenses = () =>{
        this.state.DATA = this.state.DATA.sort((a,b)=> b.date2 - a.date2);
    }

    goToAddExpenses = () => {
      const {navigation} = this.props;
      navigation.navigate('Storage',{ UserEmailId: this.state.UserEmailId });
     //navigation.navigate('AddExpense');
    }

    handleConfirm=(date) => {
      this.state.SelectedDate = date;
      this.setState({FromDateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
      this.setState({visibility:false})
      this.sortByMonthsYears();
    }

    handleConfirm2=(date) => {
      this.state.ToSelectedDate = date;
      this.setState({ToDateDisplay:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()});
      this.setState({visibility2:false})
      this.sortByMonthsYears();
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
   
    if(this.state.loading)
        return null;

    return (
        <SafeAreaView style={styles.container}>
          <Image style={{resizeMode:'contain',width:'60%'}}
            source={require('./Images/ExpenseTitle.jpg')}/>
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
        <SectionList
          style={{width: '90%'}}
          sections={this.state.SortedData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => 
          <TouchableOpacity onPress={this.AlertRemoveTransaction.bind(this, item)}>
          <Item title={item.type
            + '\n' + item.name 
            + '\nAmount spent: $' +item.amount
            + '\nDate: '+ item.date}/>
            </TouchableOpacity>}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
          <TouchableOpacity onPress={this.goToAddExpenses}>
                <Image style={{resizeMode:'contain',width: 400,height:100}}
            source={require('./Images/AddExpenseButton.jpg')}/>
                </TouchableOpacity>
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
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: "#73cdfc",
    marginVertical: '0.3%'
  },
  header: {
    color: 'white',
    fontSize: 32,
    backgroundColor: "#00c2b7"
  },
  title: {
    color: 'white',
    fontSize: 24
  }
});