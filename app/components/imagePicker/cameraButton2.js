import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
    View,
    Text,
    ToastAndroid,
    CameraRoll,
    PermissionsAndroid

} from 'react-native';

import {
    RkText,
    RkButton,
    RkComponent,
    RkStyleSheet,
  } from 'react-native-ui-kitten';

  
var ImagePicker = require('react-native-image-picker');

import { FontAwesome } from '../../assets/icons'; 
import Icon from 'react-native-vector-icons/Ionicons';

const options = {
    title: '选择图片', 
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', 
    chooseFromLibraryButtonTitle: '图片库', 
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high', 
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2, 
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    // storageOptions: { 
    //     skipBackup: true, 
    //     path: 'images'
    // }
};

export class CameraButton2 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            modalVisible:false,
        }
    }

    navigation = ()=>{ 
       
    }
    toggleModal = ()=>{
        this.setState({modalVisible: !this.state.modalVisible});
    }

    render() {
        
        const {photos,type} = this.props;
        let conText;
        if(photos.length > 0){
            conText = (<View style={styles.countBox}>
                <Text style={styles.count}>{photos.length}</Text>
            </View>);
        }
        return (
            <TouchableOpacity
                // onPress={this.showImagePicker.bind(this)}
                style={[this.props.style,styles.cameraBtn]}>
                <View>
                    {/* <Icon name="md-camera" color="#aaa" size={34}/> */}
                    <RkButton rkType='clear'  style={styles.buttonSection} onPress={this.test}> 
                        <RkText rkType="awesome hintColor"  style={styles.cameraIconBtn}>{FontAwesome.camera}</RkText>
                    </RkButton>
                    {conText}
                </View>
            </TouchableOpacity>
        )
    }

   test = async () => {  
        try{
        //let canUse = await this.requestCameraPermission(); 
        let canUse = true; 
        if(canUse){
            CameraRoll.getPhotos({
                first: 20,
                assetType: 'Photos',
                mimeTypes:["image/jpeg"]
            })
            .then(r => {
              
                this.setState({ photos: r.edges }); 

                const navigationParams = { photos: r.edges };
                console.log(this.state.photos.length);  

                this.props.navigation.navigate('PhotoViewer', navigationParams); 
            })
            .catch((err) => {
                //Error Loading Images
                console.log('error:', err);
            }); 
        }
       } catch(err){
           console.log(err);
       }
    }
    
  requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            return true;
          } else {
            console.log('Camera permission denied');
            return false;
          }
        } catch (err) {
          console.warn(err);

        }
    }
 
}
const styles = StyleSheet.create({
    cameraBtn: {
        padding:5
    },
    count:{
        color:'#fff',
        fontSize:12
    },
    fullBtn:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    countBox:{
        position:'absolute',
        right:-5,
        top:-5,
        alignItems:'center',
        backgroundColor:'#34A853',
        width:16,
        height:16,
        borderRadius:8,
        justifyContent:'center'
    },

    cameraIconBtn:{
        fontSize:36,
        alignSelf: 'flex-end',
        marginRight: 20, 
    },

    buttonSection:{
      flexDirection:"column"
    }
});
