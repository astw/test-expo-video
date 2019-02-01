import React from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkButton,
} from 'react-native-ui-kitten';

import { FontAwesome } from '../../assets/icons';
import { Avatar } from '../../components';
import { data } from '../../data';
import NavigationType from '../../config/navigation/propTypes';

const moment = require('moment');

// class comment
export class ClassComments extends React.Component {
  static propTypes = {
   // navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Comments'.toUpperCase(),
  };

  constructor(props) {
    super(props);
    this.state = {
      data: data.getClassComments(),
      message: ''
    };  

    // this.onSendButtonPressed = this.onSendButtonPressed.bind(this);
  }

   onSendButtonPressed = async () =>{ 
    if (!this.state.message) {
      return;
    } 
    
    await data.postAComments(this.state.message)
    .then((comments)=>{ 
        this.setState({data: comments})
    }); 
  };

  onInputChanged = (text) => {
    this.setState({ message: text });
  };

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  extractItemKey = (item) => `${item.id}`;

  renderItem = ({ item }) => (
    <View style={styles.container}>
      <TouchableOpacity >
        <Avatar rkType='circle' style={styles.avatar} img={item.user.photo} /> 
        <Image rkType='circle' style={styles.deleteButton} 
               source= {require('../../assets/icons/visaIcon.png')}  /> 
      </TouchableOpacity> 
       <View style={styles.content}>
        <View style={styles.contentHeader}> 
          <RkText rkType='header5 hintColor'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
        </View>
        <RkText rkType='primary3 mediumLine'>{item.text}</RkText>
      </View> 
     </View>
  );

  render = () => (
     <View>
        <FlatList
          style={styles.root}
          data={this.state.data}
          extraData={this.state}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={this.extractItemKey}
          renderItem={this.renderItem}
        />    
      <View style={styles.footer}>
        <RkButton style={styles.plus} rkType='clear'>
          <RkText rkType='awesome secondaryColor'>{FontAwesome.plus}</RkText>
        </RkButton>
        <RkTextInput 
          onChangeText={this.onInputChanged}
          value={this.state.message}
          multiline={true}
          rkType='row sticker'
          placeholder="Add a comment..."
        />
        <RkButton onPress={this.onSendButtonPressed} style={styles.send} rkType='circle highlight'>
          <Image source={require('../../assets/icons/sendIcon.png')} />
        </RkButton>
      </View>  
     </View>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },

  deleteButton: { 
     marginBottom:'auto'
  },
  container: {
    paddingLeft: 9,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    marginLeft: 0, 
    // backgroundColor:'green',
    flex: 2,
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

  addCommentPanel:{
    flex: 1,
  },

  footer: {
    flexDirection: 'row',
    minHeight: 60,
    padding: 10,
    backgroundColor: theme.colors.screen.alter,
  },

  plus: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 7,
  },
  send: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginBottom:'auto'
  },

}));
