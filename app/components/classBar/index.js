import React from 'react';
import { View } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';

export class ClassBar extends RkComponent { 
  componentName = 'ClassBar';
  typeMapping = {
    container: {},
    section: {},
    icon: {},
    label: {},
  };
  static data = {
    likes: 18,
    comments: 26,
    shares: 5,
  };

  constructor(props) {
    super(props); 
    this.state = {
        currentView: this.props.currentView
    }; 
  }

  componentWillReceiveProps(props) {
    const currentView = this.props.currentView;
    if (props.currentView != currentView) {
       this.state.currentView = this.props.currentView;
    }
  }

  onChildButtonPressed = () => {
     console.log('press child')
  };

  onHomeWorkButtonPressed = () => {
    
  };

  onLetterButtonPressed = () => {
     
  };

  render() {
    const {
      container, section, icon, label,
    } = this.defineStyles();

    const likes = this.state.likes + (this.props.showLabel ? ' Likes' : '');
    const comments = this.state.comments + (this.props.showLabel ? ' Comments' : '');
    const shares = this.state.shares + (this.props.showLabel ? ' Shares' : '');

    let firstStyle, secondStyle, thirdStyle

    let ss = "awesome primary"
    let lh = "awesome hintColor"

    if(this.state.currentView === 'childView'){
        firstStyle = ss;
        secondStyle = lh;
        thirdStyle = lh; 
    } else if(this.state.currentView ==='homeWorkView'){
        firstStyle = lh;
        secondStyle = ss;
        thirdStyle = lh; 
    } else if(this.state.currentView ==='letterView'){
        firstStyle = lh;
        secondStyle = lh;
        thirdStyle = ss; 
    }

    return (
      <View style={container}>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.props.onChildButtonPressed}>  
            <RkText rkType={firstStyle} style={styles.buttonSize}>{FontAwesome.user}</RkText>
            {/* <RkText rkType='primary primary4' style={label}>{likes}</RkText> */}
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.props.onHomeWorkButtonPressed}>
            <RkText rkType={secondStyle} style={styles.buttonSize}>{FontAwesome.homework}</RkText>
            {/* <RkText rkType='primary4 hintColor' style={label}>{comments}</RkText> */}
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.props.onLetterButtonPressed}>
            <RkText rkType={thirdStyle} style={styles.buttonSize}>{FontAwesome.letter}</RkText>
            {/* <RkText rkType='primary4 hintColor' style={label}>{shares}</RkText> */}
          </RkButton>
        </View>
      </View>
    );
  } 
}

const styles = RkStyleSheet.create(theme => ({
    buttonSize:{
        fontSize:32
    }
}));




