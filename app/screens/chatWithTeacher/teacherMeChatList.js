import React from 'react';
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
import { Avatar } from '../../components';
import { FontAwesome } from '../../assets/icons';
import { data } from '../../data';
import NavigationType from '../../config/navigation/propTypes';

const moment = require('moment');

export class TeacherMeChatList extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Chats List'.toUpperCase(),
  };

  state = { 
      chatList: data.getChatList(), 
      child:{} 
  };

  constructor(props) {
    super(props); 
    this.state.child = props.child; 
  }

  extractItemKey = (item) => `${item.withUser.id}`;

  onInputChanged = (event) => {
     
  };

  componentDidMount() {
    if (this.state.child) {
      data.getTeacherPrivateMessage(this.state.child.id)
        .then(( chatList ) => { 
          this.setState({ chatList: chatList}); 
          console.log('in did mount:', chatList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } 

  componentWillReceiveProps(nextProps) {

    console.log('component will receive props ....'); 
    if (this.state.child !== nextProps.child ) {
      this.setState({ child: nextProps.child });

      console.log('component will receive props ....', this.state.child.id); 
      if (this.state.child) {
        console.log('id=', this.state.child.id);
        data.getTeacherPrivateMessage(this.state.child.id)
          .then(( chatList ) => { 
            this.setState({ chatList: chatList }); 
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  onItemPressed = (item) => {
    const navigationParams = { userId: item.withUser.id };
    this.props.navigation.navigate('Chat', navigationParams);
  };

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  renderInputLabel = () => (
    <RkText rkType='awesome'>{FontAwesome.search}</RkText>
  );

  renderHeader = () => (
    <View style={styles.searchContainer}> 
    </View>
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
 