import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,Image} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {ItemSearch} from 'react-native-google-items';
import {SearchBar,ListItem} from 'react-native-elements'

export default class ItemRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      reasonToRequest:"",
      IsItemRequestActive : "",
      requestedItemName: "",
      itemStatus:"",
      requestId:"",
      userDocId: '',
      docId :'',
      Imagelink: '',
      dataSource:"",
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (itemName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    var items = await ItemSearch.searchitem(itemName,'AIzaSyASyOjOtJla-X-b3io2eLoaUc_bIRFSIIc')
    console.log("here in add request");
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "item_status" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp(),
         "image_link" : items.data[0].volumeInfo.imageLinks.smallThumbnail

    })

    await  this.getItemRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsItemRequestActive: true
      })
    })
  })

    this.setState({
        itemName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert("Item Requested Successfully")


  }

receivedItems=(itemName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_items').add({
      "user_id": userId,
      "item_name":itemName,
      "request_id"  : requestId,
      "itemStatus"  : "received",

  })
}




getIsItemRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsItemRequestActive:doc.data().IsItemRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getItemRequest =()=>{
  // getting the requested item
var itemRequest=  db.collection('requested_items')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().item_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedItemName: doc.data().item_name,
          itemStatus:doc.data().item_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and item nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var itemName =  doc.data().item_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the item " + itemName ,
            "notification_status" : "unread",
            "item_name" : itemName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getItemRequest()
  this.getIsItemRequestActive()


}

updateItemRequestStatus=()=>{
  //updating the item status after receiving the item
  db.collection('requested_items').doc(this.state.docId)
  .update({
    item_status : 'received'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsItemRequestActive: false
      })
    })
  })
}

async getItemsFromApi (itemName){
  this.setState({itemName:itemName})
    if (itemName.length >2){

    var items = await ItemSearch.searchitem(itemName,'AIzaSyA3fzlmdFTAR9P-LoqUvtdWXkRLCWAp2W0')
    this.setState({
      dataSource:items.data,
      showFlatlist:true
    })

  // console.log("here is the item data volume " ,items.data[0].volumeInfo.title);
  // console.log("here is the item data volume " ,items.data[1].volumeInfo.title);
  // console.log("here is the item data volume " ,items.data[2].volumeInfo.title);
  // console.log("here is the item data volume " ,items.data[3].volumeInfo.title);
  // console.log("here is the item data volume " ,items.data[4].volumeInfo.title);
  // console.log("this is the self link ",items.data[0].selfLink);
  // console.log("thhis is the sale",items.data[0].saleInfo.buyLink);
  // this.setState({Imagelink:items.data[0].volumeInfo.imageLinks.smallThumbnail})
}
  }


//render Items  functionto render the items from api
 renderItem = ( {item, i} ) =>{
   console.log("image link ");

  let obj ={
    title:item.volumeInfo.title,
    selfLink: item.selfLink,
    buyLink: item.saleInfo.buyLink,
    imageLink:item.volumeInfo.imageLinks
  }


   return (
     <TouchableHighlight
     style={{ alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,

    width: '90%',
    }}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={()=>{
        this.setState({
          showFlatlist:false,
          itemName:item.volumeInfo.title,

        })}
    }
      bottomDivider
      >
       <Text> {item.volumeInfo.title} </Text>

     </TouchableHighlight>


   )
 }

  render(){

    if(this.state.IsItemRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Item Name</Text>
          <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Item Status </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.receivedItems(this.state.requestedItemName)
          }}>
          <Text>I recieved the item </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Item" navigation ={this.props.navigation}/>

          <View>

          <TextInput
            style ={styles.formTextInput}
            placeholder={"enter item name"}
            onChangeText={text => this.getItemsFromApi(text)}
            onClear={text => this.getItemsFromApi('')}
            value={this.state.itemName}
          />

      {  this.state.showFlatlist ?

        (  <FlatList
        data={this.state.dataSource}
        renderItem={this.renderItem}
        enableEmptySections={true}
        style={{ marginTop: 10 }}
        keyExtractor={(item, index) => index.toString()}
      /> )
      :(
        <View style={{alignItems:'center'}}>
        <TextInput
          style ={[styles.formTextInput,{height:300}]}
          multiline
          numberOfLines ={8}
          placeholder={"Why do you need the item"}
          onChangeText ={(text)=>{
              this.setState({
                  reasonToRequest:text
              })
          }}
          value ={this.state.reasonToRequest}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{ this.addRequest(this.state.itemName,this.state.reasonToRequest);
          }}
          >
          <Text>Request</Text>
        </TouchableOpacity>
        </View>
      )
    }
            </View>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)