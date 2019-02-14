import React from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import _ from "lodash";
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
  RkButton
} from "react-native-ui-kitten";
import { Avatar } from "../../components";
import { data } from "../../data";
import NavigationType from "../../config/navigation/propTypes";

import { FontAwesome } from "../../assets/icons"; 

const moment = require("moment");

export class ParentComCenter extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired
  };
  static navigationOptions = {
    title: "家长群"
  };

  constructor(props) {
    super(props);
    this.state = {
      chatGroups: []
    };
  }

  async componentDidMount() {
    // TODO: get the current userId
    let currentUserId = 1;

    let chatGroups = await data.getMyChatGroups(currentUserId);  
    this.setState({
      chatGroups: chatGroups
    });
  }

  extractItemKey = item => `${item.id}`;

  onItemPressed = item => { 
    const navigationParams = { 
      chatGroupId: item.id,
      chatGroupName: item.groupName
    };
    this.props.navigation.navigate("ParentGroupChat", navigationParams);
  };

  renderSeparator = () => <View style={styles.separator} />;

  renderInputLabel = () => (
    <RkText rkType="awesome">{FontAwesome.search}</RkText>
  );

  renderHeader = () => (
    <View style={styles.searchContainer}>
      {/* <RkTextInput
        autoCapitalize='none'
        autoCorrect={false}
        // onChange={this.onInputChanged}
        label={this.renderInputLabel()}
        rkType='row'
        placeholder='Search'
      /> */}
    </View>
  );

  renderItem = ({ item }) => {
    const last = item.lastMessage;
    return (
      <TouchableOpacity onPress={() => this.onItemPressed(item)}>
        <View style={styles.container}>  
            <RkText rkType="awesome hintColor" style={styles.buttonSize}>
              {FontAwesome.users}
            </RkText> 
          <View style={styles.content}>
            <RkText rkType="header6">{item.groupName}</RkText> 
            <View style={styles.contentHeader}>
              <RkText
                numberOfLines={1}
                rkType="secondary5 hintColor mediumLine"
                style={{ paddingTop: 5, maxWidth: 250 }}
              >
                {last.content}
              </RkText>
              <RkText rkType="secondary5 hintColor">
                {moment()
                  .add(last.time, "seconds")
                  .format("LT")}
              </RkText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render = () => (
    <FlatList
      style={styles.root}
      data={this.state.chatGroups}
      extraData={this.state}
      ListHeaderComponent={this.renderHeader}
      ItemSeparatorComponent={this.renderSeparator}
      keyExtractor={this.extractItemKey}
      renderItem={this.renderItem}
    />
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: "center"
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 12,
    paddingTop: 7,
    flexDirection: "row"
  },
  content: {
    marginLeft: 10,
    flex: 1
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  },
  buttonSize: {
    fontSize: 24
  }
}));
