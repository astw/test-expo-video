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

const moment = require('moment'); 

export class Activities extends React.Component {

  constructor(props){
    super(props);  
    state = {
      data: this.props.activities
    }
  }

//  async componentDidMount(){   
//     let pp = await data.getRandomUser(3);
//     pp = pp.map((i, index) =>{
//        let ic = i; 
//        ic.id = index;
//        ic.photo = i.picture.large; 
//        return ic;
//     })  
//     this.setState({data: pp})
//   }

  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Article List'.toUpperCase(),
  };

  // state = {
   
  // };

  extractItemKey = (item) => `${item.id}`;

  onItemPressed = ({ item }) => {
    this.props.navigation.navigate('Article', { id: item.id });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      // onPress={() => this.onItemPressed(item)}
      >
      <RkCard style={styles.card}>
        <View rkCardHeader>
          <View>
            <RkText rkType='header4'>{item.header}</RkText>
            <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
          </View>
        </View>
        <Image rkCardImg source={item.photo} /> 
          <ClassComments  /> 

      </RkCard>
    </TouchableOpacity>
  );

  render = () => (
    <FlatList
      // data={this.state.data}
      data={this.props.activities}
      renderItem={this.renderItem}
      keyExtractor={this.extractItemKey}
      style={styles.container}
    />
  );
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  card: {
    marginVertical: 28,
    margin:40,
    // paddingHorizontal:40
  },
  footer: {
    paddingTop: 16,
  },
  time: {
    marginTop: 5,
  },
}));
