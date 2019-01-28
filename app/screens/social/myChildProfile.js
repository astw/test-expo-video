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
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'; 

export class MyChildProfile extends React.Component { 
 
  static propTypes = {
    navigation: NavigationType.isRequired 
  };
  static navigationOptions = {
    title: ''
  };

  state = {
    child: undefined,
  };

  constructor(props) {
    super(props);  
    const id = this.props.navigation.getParam('id', 1);  
    this.state = {
      child:{
        name:"", 
        className:"",
        activities:[]
      },
      children:[],

      currentIndex:0
    }; 
  }
   
  async componentDidMount(){
      let children = await data.getMyChildProfile();  
      // MyChildProfile.navigationOptions.title = user.className; 

      this.setState({
        children:children,
        child:children[0]
      }) 
  }  

  onSwipeDown(gestureState) {
    this.setState({myText: 'You swiped down!'});
  }

  async onSwipeLeft(gestureState) {
    //let user = await data.getMyChildProfile(); 
    // MyChildProfile.navigationOptions.title = user.className;

    let count = this.state.children.length; 
    let index = this.state.currentIndex; 

    if(index == 0){
      this.setState({currentIndex: count -1});
    } else {
      this.setState({currentIndex: --index});
    }

    let user = this.state.children[this.state.currentIndex]; 

    this.setState({child: user})

    console.log('You swiped left!');
  }

  async onSwipeRight(gestureState) { 

    let count = this.state.children.length; 
    let index = this.state.currentIndex; 

    if(index == count -1){
      this.setState({currentIndex: 0});
    } else {
      this.setState({currentIndex: ++index});
    }

    let user = this.state.children[this.state.currentIndex]; 

    // MyChildProfile.navigationOptions.title = user.className;
    this.setState({child: user})

    console.log('You swiped right!');
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        this.setState({backgroundColor: 'yellow'});
        break;
    }
  }
 
  render = () => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    
    return (
    <ScrollView style={styles.root}>
    <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)} 
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        // style={{ 
        //   backgroundColor: this.state.backgroundColor
        // }}
        >
        <View style={[styles.header, styles.bordered]}>  
          <RkButton style={styles.floatButtonLeft} on > &lt; </RkButton>
          <RkButton style={styles.floatButtonRight}> &gt; </RkButton>  
          <Avatar img={this.state.child.photo} rkType='big' />
          <RkText rkType='header3'>{`${this.state.child.name} ${this.state.child.className} `}</RkText>
        </View>
      </GestureRecognizer>
      <View style={[styles.userInfo, styles.bordered]}>
        <View style={styles.section}>
          <RkText rkType='header5' style={styles.space}>班主任：{this.state.child.principleTeacher} </RkText>
          <RkText rkType='secondary1 hintColor'>给老师发邮件 {this.state.child.principleTeacherEmail} </RkText>
        </View>
        {/* <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.child.followingCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Following</RkText>
        </View> */}
      </View>
      <View style={styles.buttons}>
      
      </View>
      <Articles3 navigation={this.props.navigation} naem="dsfsdfsd" activities={this.state.child.activities} /> 
      {/* <Gallery items={this.state.child.images} /> */}
    </ScrollView>
  );
  }
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
  floatButtonRight:{
    width: 25,  
    height: 25,   
    borderRadius: 12.5,            
    backgroundColor: "#D3D3D3",
    opacity:0.6,                                    
    position: 'absolute',                                          
    top:20,                                                    
    right: 20, 
  },
  floatButtonLeft:{
  
    width: 25,  
    height: 25,   
    borderRadius: 12.5,            
    backgroundColor: "#D3D3D3",
    opacity:0.6,                                    
    position: 'absolute',                                          
    top:20,                                                    
    left: 20, 
  }
}));
