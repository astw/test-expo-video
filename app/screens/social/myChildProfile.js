import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import {
  RkText,
  RkButton, RkStyleSheet,
} from 'react-native-ui-kitten';
import { Avatar } from '../../components/avatar';
import { Gallery } from '../../components/gallery';
import { data } from '../../data/';
import formatNumber from '../../utils/textUtils';
import NavigationType from '../../config/navigation/propTypes';
import {Articles3} from '../articles';

export class MyChildProfile extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: ''
  };

  state = {
    data: undefined,
  };

  constructor(props) {
    super(props);
    const id = this.props.navigation.getParam('id', 1); 
    // this.state.data = data.getUser(id);
    this.state = {data:{name:"", className:""}};
  }
   
  async componentWillMount(){
      let user = await data.getMyChildProfile(); 
      // MyChildProfile.navigationOptions.title = user.className;
      this.setState({data: user})
  } 

  render = () => (
    <ScrollView style={styles.root}>
      <View style={[styles.header, styles.bordered]}> 
        <Avatar img={this.state.data.photo} rkType='big' />
        <RkText rkType='header3'>{`${this.state.data.name} ${this.state.data.className} `}</RkText>
      </View>
      <View style={[styles.userInfo, styles.bordered]}>
        {/* <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.data.postCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Posts</RkText>
        </View> */}
        <View style={styles.section}>
          <RkText rkType='header5' style={styles.space}>班主任：{this.state.data.principleTeacher} </RkText>
          <RkText rkType='secondary1 hintColor'>给老师发邮件 {this.state.data.principleTeacherEmail} </RkText>
        </View>
        {/* <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.data.followingCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Following</RkText>
        </View> */}
      </View>
      <View style={styles.buttons}>
      
      </View>
      <Articles3 navigation={this.props.navigation} /> 
      {/* <Gallery items={this.state.data.images} /> */}
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17,
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  space: {
    marginBottom: 3,
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42,
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center',
  },
}));
