import React,{Component} from 'react';
import {View,Text,FlatList,StyleSheet} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {ListItem,Icon} from 'react-native-elements';

export default class NotificationScreen extends Component{

    constructor(props){
        super(props)
        this.state = {
          userId : firebase.auth().currentUser.email,
          allNotifications : []
        }
        this.notificationRef= null
      }
   
   
      getNotifications =()=>{
        this.requestRef = db.collection("all_notifications").where("notification_status" ,'==', "unread")
        .where("targeted_user_Id",'==',this.state.userId)
        .onSnapshot((snapshot)=>{
          var allNotifications = []
          snapshot.docs.map((doc) =>{
            var notification = doc.data()
           notification["doc_id"] = doc.id
            allNotifications.push(notification)
          });
          this.setState({
            allNotifications:allNotifications
          });
        })
      }
   
      componentWillMount(){
          this.getNotifications();
      }
   
   
      keyExtractor = (item, index) => index.toString()
   
      renderItem = ( {item, i} ) =>(
        <ListItem
          key={index}
          title={item.item_name}
          subtitle={item.message}
          leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          bottomDivider
        />
      )
   
      render(){
        return(
            <View style={styles.container}>
          <View style={{flex:0.1}}>
            <MyHeader navigation={this.props.navigation} title="Notifications"/>
            </View>
            <View style={{flex:1}}>
              {
                this.state.allNotifications.length === 0
                ?(
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{ fontSize: 20}}>You have no notifications</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allNotifications}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }
      }


   
   
   const styles = StyleSheet.create({
    container:{
        flex:1
    },
    
   })