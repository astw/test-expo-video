import React from 'react';
import { View } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
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
     
    };
  }

  onChildButtonPressed = () => {
     
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

    return (
      <View style={container}>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onChildButtonPressed}>
            <RkText rkType='awesome primary' style={icon}>{FontAwesome.user}</RkText>
            {/* <RkText rkType='primary primary4' style={label}>{likes}</RkText> */}
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onHomeWorkButtonPressed}>
            <RkText rkType='awesome hintColor' style={icon}>{FontAwesome.homework}</RkText>
            {/* <RkText rkType='primary4 hintColor' style={label}>{comments}</RkText> */}
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onLetterButtonPressed}>
            <RkText rkType='awesome hintColor' style={icon}>{FontAwesome.letter}</RkText>
            {/* <RkText rkType='primary4 hintColor' style={label}>{shares}</RkText> */}
          </RkButton>
        </View>
      </View>
    );
  }
}
