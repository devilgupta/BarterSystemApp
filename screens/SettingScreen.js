import React,{Component} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity, Alert} from 'react-native';
import {TextComponent} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class SettingScreen extends Component{
    constructor(){
        super();
        this.state={
            firstName:'',
            lastName:'',
            address:'',
            contact:'',
            emailId:'',
            docId:'',
            password:''
        }
    }

    getUserDetails=()=>{
        var user=firebase.auth().currentUser;
        var email=user.email;
        db.collection('users').where('email_id','==',email).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var data=doc.data()
                this.setState({
                    emailId:data.email_id,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    address:data.address,
                    contact:data.contact,
                    docId:docId
                })
            })
        })
    }

    updateUserDetails=()=>{
        db.collection('users').doc(this.state.docId).update({
            'first_name':this.state.firstName,
            'last_name':this.state.lastName,
            'address':this.state.address,
            'contact':this.state.contact,
            'email_id':this.state.emailId
        })
        Alert.alert("Profile Updated Successfully")
    }
    componentDidMount(){
        this.getUserDetails();
    }
    render(){
        return(
            <View style={styles.container}>
                <MyHeader title="settings" navigation={this.props.navigation}/>
                <Text>Setting Screen</Text>
                <View style={styles.formContainer}>
                    <TextInput
                    style={styles.formTextInput}
                    placeholder={"First Name"}
                    maxLength={13}
                    onChangeText={(text)=>{
                        this.setState({
                            firstName:text
                        })
                    }}
                    value={this.state.firstName}
                    />
                     <TextInput
                    style={styles.formTextInput}
                    placeholder={"Last Name"}
                    maxLength={13}
                    onChangeText={(text)=>{
                        this.setState({
                            lastName:text
                        })
                    }}
                    value={this.state.lastName}
                    />
                     <TextInput
                    style={styles.formTextInput}
                    placeholder={"Address"}
                    multiline={4}
                    onChangeText={(text)=>{
                        this.setState({
                            address:text
                        })
                    }}
                    value={this.state.address}
                    />
                     <TextInput
                    style={styles.formTextInput}
                    placeholder={"Contact No."}
                    maxLength={10}
                    keyboardType={'numeric'}
                    onChangeText={(text)=>{
                        this.setState({
                            contact:text
                        })
                    }}
                    value={this.state.contact}
                    />
                     <TextInput
                    style={styles.formTextInput}
                    placeholder={"abc@example.com"}
                    keyboardType={'email-address'}
                    onChangeText={(text)=>{
                        this.setState({
                            emailId:text
                        })
                    }}
                    value={this.state.emailId}
                    />
                     <TextInput
                    style={styles.formTextInput}
                    placeholder={"First Name"}
                    maxLength={13}
                    onChangeText={(text)=>{
                        this.setState({
                            firstName:text
                        })
                    }}
                    value={this.state.firstName}
                    />
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={()=>{
                        this.updateUserDetails();
                    }}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
             </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    formContainer:{
        flex:1,
        width:'100%',
        alignItems:'center'
    },
    formTextInput:{
        width:'75%',
        height:35,
        alignSelf:'center',
        borderColor:'red',
        borderRadius:10,
        borderWidth:1.5,
        marginTop:20,
        padding:10,
    },
    button:{
        width:'80%',
        height:30,
        borderWidth:1.5,
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:'yellow',
        shadowColor:'black',
        textShadowOffset:{
            width:0,
            height:8
        },
        shadowOpacity:0.44,
        shadowRadius:10.35,
        elevation:16,
        marginTop:20
    },
    buttonText:{
        fontSize:25,
        fontWeight:'bold',
        color:'black'
    }
})