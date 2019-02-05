import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
} from 'react-native-ui-kitten';
import { Navigation } from 'react-native-navigation';
import { Avatar } from '../../components';
import { FontAwesome } from '../../assets/icons';
import { data } from '../../data';
import NavigationType from '../../config/navigation/propTypes'; 

const moment = require('moment');
//chat between teachers and me
//multiple teachers will show mulitple lines. 

export class TeacherMeChatList extends React.Component {

  state = { 
      chatList: data.getConversation(),
      child: null, 
  };

  constructor(props) {
    super(props); 
    this.state.child = props.child; 
  }

  static propTypes = {
    navigation: NavigationType.isRequired, 
  };
  static navigationOptions = {
    title: 'Chats List'.toUpperCase(),
  };

  // componentDidMount() {
  //   if (this.state.child) {
  //     data.getTeacherPrivateMessage(this.state.child.id)
  //       .then(( chatList ) => { 
  //         this.setState({ chatList: chatList}); 
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // } 

  // componentWillReceiveProps(nextProps) {
  //   if (this.state.child !== nextProps.child ) {
  //     this.setState({ child: nextProps.child });

  //     if (this.state.child) {
  //       data.getTeacherPrivateMessage(this.state.child.id)
  //         .then(( chatList ) => { 
  //           this.setState({ chatList: chatList}); 
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // }
  extractItemKey = (item) => `${item.withUser.id}`;
  onItemPressed = (item) => {
    const navigationParams = { userId: item.withUser.id };
    console.log('navigationParams = ', navigationParams); 
    this.props.navigation.navigate('Chat', navigationParams);
  };

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  renderInputLabel = () => (
    <RkText rkType='awesome'>{FontAwesome.search}</RkText>
  );

  renderHeader = () => (
    <View style={styles.searchContainer} />
  );

  renderItem = ({ item }) => {
    const last = item.messages[item.messages.length - 1];
    return (
      <TouchableOpacity onPress={() => this.onItemPressed(item)}>
        <View style={styles.container}>
          <Avatar rkType='circle' style={styles.avatar} img={item.withUser.photo} />
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <RkText rkType='header5'>{`${item.withUser.firstName} ${item.withUser.lastName}`}</RkText>
              <RkText rkType='secondary4 hintColor'>
                {moment().add(last.time, 'seconds').format('LT')}
              </RkText>
            </View>
            <RkText numberOfLines={2} rkType='primary3 mediumLine' style={{ paddingTop: 5 }}>
              {last.text}
            </RkText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render = () => (
    <FlatList
      style={styles.root}
      data={this.state.chatList}
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
    backgroundColor: theme.colors.screen.base,
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center',
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingBottom: 12,
    paddingTop: 7,
    flexDirection: 'row',
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base,
  },
}));
