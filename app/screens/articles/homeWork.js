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
import { SocialBar } from '../../components';
import { data } from '../../data';
import NavigationType from '../../config/navigation/propTypes';
import axios from 'axios'; 
import { Comments, ClassComments} from '../messaging';

import _ from 'lodash';

const moment = require('moment'); 

export class HomeWork extends React.Component {

  constructor(props){
    super(props);  
    state = {
      homeWork: []
    }
  }

 async componentDidMount(){   
    let homeWorks = await data.getHomeWork()
    let homeWork = homeWorks[0].homeWork; 
    this.setState({homeWork})
  }

  componentWillReceiveProps(nextProps){
    if(this.state.child != nextProps.child){
      this.setState(
        {child: nextProps.child}
      )
      
      data.getHomeWork()
      .then((homeWorks)=>{    
        let hw = _.find(homeWorks, i =>i.childId == nextProps.child.id); 
        if(hw && hw.homeWork.length > 0){ 
          this.setState({homeWork: hw.homeWork});
        } else {
          this.setState({homeWork:null}) 
        }  
      })
      .catch(e=>{
      })
    }
  }

  static propTypes = {
    //navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: '作业'
  };

  state = {
    user:undefined,
    homeWork:[]
  };

  extractItemKey = (item) => `${item.id}`;

  onItemPressed = ({ item }) => {
    //this.props.navigation.navigate('Article', { id: item.id });
  };

  renderItem = ({item}) => { 

    let mediaDiv = <View></View>;
    if(item.photo){
      mediaDiv =  <Image rkCardImg source={item.photo} />
    } 
      
    let hw =   <View style={styles.container}>
                    <RkCard rkType='blog' style={styles.card}>
                      {mediaDiv}
                        {/* <View rkCardHeader style={styles.content}>
                          <RkText style={styles.section} rkType='header4'>{item.title}</RkText>
                        </View> */}
                        <View rkCardContent>
                            <View style={styles.content}>
                                <RkText rkType='primary3 mediumLine' style={styles.homeWorkText }>{item.desc}</RkText>
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
    let hasHomeWork = this.state.homeWork && this.state.homeWork.length > 0; 
    if(hasHomeWork){
      renderContent = <FlatList 
                          data={this.state.homeWork}
                          renderItem={this.renderItem}
                          keyExtractor={this.extractItemKey}
                          style={styles.container}
                        />;
    } else {
      let msg = '如果老师留了作业，你就会看到。'
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
  homeWorkText:{ 
    paddingTop:5
  }
  
}));
