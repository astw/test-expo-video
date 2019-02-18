import React from "react";
import {
  TextInput,
  FlatList,
  View,
  Platform,
  Image,
  TouchableOpacity,
  Keyboard,
  InteractionManager,
  Dimensions
} from "react-native";
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from "react-native-ui-kitten";
import _ from "lodash";
import Emoticons from "react-native-emoticons";

import * as emoticons from "react-native-emoticons";

import { ImagePicker, Permissions } from "expo";

import { FontAwesome } from "../../assets/icons";
import { data } from "../../data";
import { Avatar } from "../../components/avatar";
import { scale } from "../../utils/scale";
import { CameraButton } from "../../components";
import NavigationType from "../../config/navigation/propTypes";

const moment = require("moment");

const {height, width} = Dimensions.get('window');

RkTheme.setType("RkTextInput", "small", {
  input: {
    backgroundColor: "white",
    marginLeft: 0,
    marginHorizontal: 0,
    borderRadius: 8,
    height: 40
  },
  color: "gray",
  borderRadius: 8,
  container: {
    paddingHorizontal: 5
  }
});

export class GroupChat extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired
  };

  static OtherPerson = {};

  static Me = {};
  static navigationOptions = ({ navigation }) => {
    const userId = navigation.state.params
      ? navigation.state.params.userId
      : undefined;
    const user = data.getUser(userId);
    GroupChat.OtherPerson = user;
    // TODO: to find out the current user ID;
    // For now just use hard code 2

    GroupChat.Me = data.getUser(2);
    return {
      headerTitle: GroupChat.renderNavigationTitle(navigation, user),
      headerRight: GroupChat.renderNavigationAvatar(navigation, user)
    };
  };

  constructor(props) {
    super(props);

    const chatGroupName = this.props.navigation.getParam("chatGroupName", "");
    this.state = {
      chatGroupName: chatGroupName,
      chats: [],
      message: "",
      showPlusArea: false,
      showEmoticons: false,
      showCamera: false
    };
  }

  componentDidMount() {
    const chatGroupId = this.props.navigation.getParam(
      "chatGroupId",
      undefined
    );

    data
      .getChatsByChatGroupId(chatGroupId)
      .then(chats => {
        this.setState({ chats });
      })
      .catch(e => {
        console.log(e);
      });

    InteractionManager.runAfterInteractions(() => {
      this.listRef.scrollToEnd();
    });
  }

  setListRef = ref => {
    this.listRef = ref;
  };

  extractItemKey = item => `${item.id}`;

  scrollToEnd = () => { 

    if (Platform.OS === "ios") {
      this.listRef.scrollToEnd();
    } else {
      // below function does work in Android
      //_.delay(this.listRef.scrollToEnd, 100)

      setTimeout(() => {
        this.listRef.scrollToEnd();
      }, 100);
    }
  };

  onInputChanged = text => {
    this.setState({ message: text });
  };

  onSendButtonPressed = () => {
    if (!this.state.message) {
      return;
    }
    // TODO call service to send to server
    this.state.chats.push({
      id: this.state.chats.length,
      time: 0,
      type: "text",
      content: this.state.message,
      fromUser: GroupChat.Me
    });
    this.scrollToEnd(true);

    this.setState({
      message: "",
      showEmoticons: false
    });
  };

  static onNavigationTitlePressed = (navigation, user) => {
    navigation.navigate("ProfileV1", { id: user.id });
  };

  static onNavigationAvatarPressed = (navigation, user) => {
    navigation.navigate("ProfileV1", { id: user.id });
  };

  onPlusButtonClicked = () => {
    this.setState({
      showPlusArea: !this.state.showPlusArea,
      showEmoticons: !this.state.showEmoticons
    });
  };

  _onEmoticonPress = e => {
    console.log(e);
    this.setState({
      message: `${this.state.message}${e.code}`
    });
  };

  _onBackspacePress = e => {
    let { message } = this.state;
    if (!message) return;

    message = emoticons.splitter(message).slice(0, -1);
    this.setState({
      showPlusArea: !this.state.showPlusArea,
      showEmoticons: !this.state.showEmoticons,
      message
    });
  };

  onVideoCaptureBack = (params) =>{
    
    if(!params || !params.mediaFile) {
      return;
    }
    const mediaFile = params.mediaFile; 
    
    if(!mediaFile) return;
       // TODO call service to send to server
       this.state.chats.push({
        id: this.state.chats.length,
        time: 0,
        type: "text",
        content: mediaFile ? mediaFile.uri: '',
        fromUser: GroupChat.Me
      });
      this.scrollToEnd(true);
  
      this.setState({
        message: "",
        showEmoticons: false,
        showCamera: false
      });
  };

  onVideoCameraButtonPress = e => {   
    this.props.navigation.navigate('VideoCapture', { goBack: this.onVideoCaptureBack });
  };

  onPhotoButtonPress = async e => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ userPhoto: result.uri });
    }

    this.setState({
      showCamera: false,
      showEmoticons: false,
    });
  };

  onCameraButtonPress = async e => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      return;
    }

    const options = {
      allowsEditing: true,
      aspect: [4, 3],
    }; 
    
    let result = await ImagePicker.launchCameraAsync(options)({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ userPhoto: result.uri });
    }

    this.setState({
      showCamera: false,
      showEmoticons: false,
    });
  };

  static renderNavigationTitle = (navigation, user) => (
    <TouchableOpacity
      onPress={() => GroupChat.onNavigationTitlePressed(navigation, user)}
    >
      <View style={styles.header}>
        <RkText rkType="secondary3">
          {navigation.getParam("chatGroupName")}
        </RkText>
      </View>
    </TouchableOpacity>
  );

  static renderNavigationAvatar = (navigation, user) => (
    <TouchableOpacity
      onPress={() => GroupChat.onNavigationAvatarPressed(navigation, user)}
    >
      <Avatar style={styles.avatar} rkType="small" img={user.photo} />
    </TouchableOpacity>
  );

  renderDate = (date, timeStyle) => (
    <View>
      <RkText style={timeStyle} rkType="secondary7 hintColor">
        {moment()
          .add(date, "seconds")
          .format("LT")}
      </RkText>
    </View>
  );

  showPlusArea = () => (
    <View>
      <Emoticons
        onEmoticonPress={this._onEmoticonPress.bind(this)}
        onBackspacePress={this._onBackspacePress.bind(this)}
        show={this.state.showEmoticons}
        concise={true}
        showHistoryBar={true}
        showPlusBar={false}
      />
    </View>
  );

  showCamera = () => {
    if (this.state.showCamera) {
      return (
        <View style={styles.footer}>
          <CameraButton image={FontAwesome.picture} onPress={this.onPhotoButtonPress} photos={[]} />
          <CameraButton image={FontAwesome.camera} onPress={this.onCameraButtonPress} photos={[]} /> 
          <CameraButton image={FontAwesome.videoCamera} onPress={this.onCameraButtonPress} photos={[]} />
         
           <RkButton
            style={styles.plus}
            rkType="clear"
            onPress={this.onCameraButtonPress}
          >
            <RkText rkType="awesome primary">{FontAwesome.camera}</RkText>
          </RkButton>
          <RkButton
            style={styles.plus}
            rkType="clear"
            onPress={this.onVideoCameraButtonPress}
          >
            <RkText rkType="awesome primary" style={{ fontSize: 30 }}>
              {FontAwesome.videoCamera}
            </RkText>
          </RkButton>
        </View>
      );
    } else return null;
  };

  renderItem = ({ item }) => {
    const isIncoming = item.fromUser.id !== GroupChat.Me.id;
    const backgroundColor = isIncoming
      ? RkTheme.current.colors.border.base
      : "#7dbd2a";
    //: RkTheme.current.colors.chat.messageOutBackground;
    const itemStyle = isIncoming ? styles.itemIn : styles.itemOut;

    let avatorDiv;
    if (isIncoming) {
      avatorDiv = (
        <View style={[styles.userContainer, styles.itemIn]}>
          <Avatar
            style={styles.avatar}
            rkType="small"
            img={item.fromUser.photo}
          />
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <RkText rkType="header6" style={styles.itemIn}>
                {item.fromUser.firstName}
              </RkText>
              {/* {this.renderDate(item.time, styles.timeIn)} */}
            </View>
            <View style={[styles.balloon, { backgroundColor }]}>
              <RkText
                rkType="primary2 mediumLine chat"
                style={{ paddingTop: 1 }}
              >
                {item.content}
              </RkText>
              {this.renderDate(item.time, styles.timeIn)}
            </View>
          </View>
        </View>
      );
    } else {
      avatorDiv = (
        <View style={[styles.userContainer, styles.itemOut]}>
          <View style={styles.content}>
            <View style={[styles.contentHeader, styles.itemOut]} />
            <View style={[styles.balloon, { backgroundColor }]}>
              <RkText
                rkType="primary2 mediumLine chat"
                style={{ paddingTop: 5 }}
              >
                {item.content}
              </RkText>
              {this.renderDate(item.time, styles.timeIn)}
            </View>
          </View>
          <Avatar
            style={styles.avatar}
            rkType="small"
            img={item.fromUser.photo}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            showCamera: false,
            showEmoticons: false
          })
        }
      >
        <View style={[styles, itemStyle]}>{avatorDiv}</View>
      </TouchableOpacity>
    );
  };

  render = () => {
    let plusArea;

    if (this.state.showEmoticons) plusArea = this.showPlusArea();
    else plusArea = null;

    return (
      <RkAvoidKeyboard
        style={styles.container}
        onResponderRelease={Keyboard.dismiss}
      > 
       <FlatList
          ref={this.setListRef}
          extraData={this.state}
          style={styles.list}
          data={this.state.chats}
          keyExtractor={this.extractItemKey}
          renderItem={this.renderItem}
        /> 
        {plusArea}
        {this.showCamera()}
        <View style={styles.footer}>
          <RkButton
            style={styles.plus}
            rkType="clear"
            onPress={() =>
              this.setState({
                showCamera: !this.state.showCamera,
                showEmoticons: false
              })
            }
          >
            <RkText rkType="awesome secondaryColor">{FontAwesome.plus}</RkText>
          </RkButton>
          <RkButton
            style={styles.plus}
            rkType="clear"
            onPress={() =>
              this.setState({
                showEmoticons: !this.state.showEmoticons,
                showCamera: false
              })
            }
          >
            <RkText rkType="awesome secondaryColor" style={{ fontSize: 30 }}>
              {FontAwesome.smile}
            </RkText>
          </RkButton>

          {/* <TextInput
              style={ styles.textInput }
              onChangeText={(text) => this.setState({message:text})}
              value={this.state.message}
              onFocus={this.scrollToEnd}
              onBlur={this.scrollToEnd} 
              underlineColorAndroid='transparent'
              multiline = { true }
            /> */}
          <RkTextInput
            onFocus={this.scrollToEnd}
            onBlur={this.scrollToEnd}
            onChangeText={this.onInputChanged}
            underlineColorAndroid="transparent"
            multiline={true}
            spellCheck={false}
            autoCorrect={false}
            value={this.state.message}
            rkType="info row small"
            // row sticker
            placeholder="Add a comment..."
          />

          <RkButton
            onPress={this.onSendButtonPressed}
            style={styles.send}
            rkType="small info highlight"
          >
            <Image source={require("../../assets/icons/sendIcon.png")} />
          </RkButton>
        </View>
      </RkAvoidKeyboard>
    );
  };
}

const styles = RkStyleSheet.create(theme => ({
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: "center"
  },

  textInput: {
    flexGrow: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: theme.colors.screen.base,
    borderRadius: 5,
    fontSize: 24
  },

  userContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 12,
    paddingTop: 7,
    flexDirection: "row",
    borderColor: "red"
  },

  header: {
    alignItems: "center"
  },
  avatar: {
    marginRight: 5,
    marginLeft: 5
  },
  avatarRight: {
    marginRight: 0
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.colors.screen.base
  },
  list: {
    paddingHorizontal: 17,
    flexGrow: 0
  },
  videoArea: {
    flexDirection: "row",
    height: height,
    width: width,
    padding: 10,
    backgroundColor: theme.colors.screen.alter
  },
  footer: {
    flexDirection: "row",
    minHeight: 60,
    padding: 10,
    backgroundColor: theme.colors.screen.alter
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: "row"
  },
  itemIn: {
    alignItems: "flex-start",
    marginLeft: 0
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 5
  },
  balloon: {
    maxWidth: scale(250),
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 10
  },
  timeIn: {
    alignSelf: "flex-end",
    margin: 10
  },
  timeOut: {
    alignSelf: "flex-start",
    margin: 20
  },
  plus: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 7
  },
  send: {
    width: 40,
    height: 40,
    marginLeft: 10,
    alignSelf: "center"
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  }
}));
