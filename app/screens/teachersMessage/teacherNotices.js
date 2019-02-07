import React from 'react';
import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RkText,
  RkCard, RkStyleSheet,
} from 'react-native-ui-kitten'; 
import { data } from '../../data';
import NavigationType from '../../config/navigation/propTypes';
import axios from 'axios';  
import _ from 'lodash';

const moment = require('moment'); 

export class TeacherNotices extends React.Component {

  constructor(props){
    super(props);  
    state = {
      notices: []
    }
  }

 async componentDidMount(){   
    let notices = await data.getTeachersNotices() 
    console.log('notices:', notices);
    this.setState({notices})
  }
 
  static propTypes = {
    //navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: '老师通知'
  };

  state = { 
    notices:[]
  };

  extractItemKey = (item) => `${item.id}`;
 

  renderItem = ({item}) => { 

    let mediaDiv = <View></View>;
    if(item.photo){
      mediaDiv =  <Image rkCardImg source={item.photo} />
    } 
      
    let hw =   <View style={styles.container}>
                    <RkCard rkType='blog' style={styles.card}>
                      {mediaDiv} 
                        <View rkCardContent>
                            <View style={styles.content}>
                                <RkText rkType='primary3 mediumLine' style={styles.noticeContent }>{item.content}</RkText>
                            </View>
                        </View>
                        <View rkCardFooter>
                        <View style={styles.userInfo}>
                            {/* <Avatar style={styles.avatar} rkType='circle small' img={item.user.photo} /> */}
                            <RkText rkType='header6'>{`${item.teacher.name} `}</RkText>
                        </View>
                        <RkText rkType='secondary2 hintColor'>{item.dateTime}</RkText>
                        </View>
                    </RkCard>
                </View>;
       
    return hw; 
  };

  render = () => {
    let renderContent;  
    let hasNotice = this.state.notices && this.state.notices.length > 0; 
    if(hasNotice){
      renderContent = <FlatList 
                          data={this.state.notices}
                          renderItem={this.renderItem}
                          keyExtractor={this.extractItemKey}
                          style={styles.container}
                        />;
    } else {
      let msg = '如果有老师留的通知，你就会看到。'
      renderContent = <View style={styles.container}>
                        <RkCard rkType='blog' style={styles.card}> 
                            <View rkCardContent>
                                <View style={styles.content}>
                                    <RkText rkType='primary3 mediumLine' 
                                    style={styles.homeWorkText }>{ msg }</RkText>
                                </View>
                            </View> 
                        </RkCard>
                    </View>;
    } 

    return renderContent;
  } 
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    margin:5,
    paddingHorizontal: 10,
    paddingVertical: 10, 
  },
  card: {
    marginVertical: 10,
    margin:10,
    // paddingHorizontal:40
  },
  footer: {
    paddingTop: 16,
  },
  time: {
    marginTop: 5,
  },
  content: {
    //marginLeft: 10,
    flex: 2, 
    padding:5
  },
  noticeContent:{
    paddingTop:5
  }
  
}));
