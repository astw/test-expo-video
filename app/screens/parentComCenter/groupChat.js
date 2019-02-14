import React from "react";
import {
  FlatList,
  View,
  Platform,
  Image,
  TouchableOpacity,
  Keyboard,
  InteractionManager
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
import { FontAwesome } from "../../assets/icons";
import { data } from "../../data";
import { Avatar } from "../../components/avatar";
import { scale } from "../../utils/scale";

import NavigationType from "../../config/navigation/propTypes";

const moment = require("moment");

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
      chats: []
    };
  }

  async componentWillMount() {
    const chatGroupId = this.props.navigation.getParam(
      "chatGroupId",
      undefined
    );
    try {
      const chats = await data.getChatsByChatGroupId(chatGroupId);
      this.setState({ chats });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
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
      _.delay(this.listRef.scrollToEnd, 100);
    }
  };

  onInputChanged = text => {
    this.setState({ message: text });
  };

  onSendButtonPressed = () => {
    if (!this.state.message) {
      return;
    }
    this.state.chats.push({
      id: this.state.chats.length,
      time: 0,
      type: "text",
      content: this.state.message,
      fromUser : GroupChat.Me
    });
    this.setState({ message: "" });
    this.scrollToEnd(true);
  };

  static onNavigationTitlePressed = (navigation, user) => {
    navigation.navigate("ProfileV1", { id: user.id });
  };

  static onNavigationAvatarPressed = (navigation, user) => {
    navigation.navigate("ProfileV1", { id: user.id });
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

  renderItem = ({ item }) => {
    console.log(item.fromUser.id, GroupChat.Me.id);
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
                style={{ paddingTop: 1}}
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
      <View style={[styles, itemStyle]}>
        {avatorDiv} 
      </View>
    );
  };

  render = () => (
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
      <View style={styles.footer}>
        <RkButton style={styles.plus} rkType="clear">
          <RkText rkType="awesome secondaryColor">{FontAwesome.plus}</RkText>
        </RkButton>
        <RkTextInput
          onFocus={this.scrollToEnd}
          onBlur={this.scrollToEnd}
          onChangeText={this.onInputChanged}
          value={this.state.message}
          rkType="row sticker"
          placeholder="Add a comment..."
        />
        <RkButton
          onPress={this.onSendButtonPressed}
          style={styles.send}
          rkType="circle highlight"
        >
          <Image source={require("../../assets/icons/sendIcon.png")} />
        </RkButton>
      </View>
    </RkAvoidKeyboard>
  );
}

const styles = RkStyleSheet.create(theme => ({
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
    backgroundColor: theme.colors.screen.base
  },
  list: {
    paddingHorizontal: 17
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
    paddingBottom: 15,
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
    marginLeft: 10
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  }
}));
