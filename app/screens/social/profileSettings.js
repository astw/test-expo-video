import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from "react-native-ui-kitten";
import { data } from "../../data";
import {
  Avatar,
  SocialSetting,
  GradientButton,
  CameraButton
} from "../../components";

import { FontAwesome } from "../../assets/icons";

import { ImagePicker, Permissions } from "expo";

export class ProfileSettings extends React.Component {
  static navigationOptions = {
    title: "个人信息".toUpperCase()
  };

  constructor(props) {
    super(props);

    const user = data.getUser();
    this.state = {
      userPhoto: user.photo,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      secondPhone: user.secondPhone,
      password: user.password,
      newPassword: user.newPassword,
      confirmPassword: user.confirmPassword
    };
  }

  onUserNameInputChanged = text => {
    this.setState({ userName: text });
  };

  onEmailInputChanged = text => {
    this.setState({ email: text });
  };

  onPhoneInputChanged = text => {
    this.setState({ phone: text });
  };

  onSecondPhoneInputChanged = text => {
    this.setState({ secondPhone: text });
  };

  onPasswordInputChanged = text => {
    this.setState({ password: text });
  };

  onNewPasswordInputChanged = text => {
    this.setState({ newPassword: text });
  };

  onConfirmPasswordInputChanged = text => {
    this.setState({ confirmPassword: text });
  };

  onSaveBtnClicked = async () => {
    let result = await data.saveProfile(this.state);
  };

  onChangePhotoClicked = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
    }); 

    if (!result.cancelled) {
      this.setState({ userPhoto: result.uri });
    }
  };

  render = () => (
    <ScrollView style={styles.root}>
      <RkAvoidKeyboard>
        <View style={styles.header}>
          <Avatar img={this.state.userPhoto} rkType="big" />
          <CameraButton
            // navigation={this.props.navigation}
            image={FontAwesome.picture}
            onPress={this.onChangePhotoClicked}
            photos={[]}
          />
        </View>
        <View style={styles.section}>
          {/* <View style={[styles.row, styles.heading]}> */}
          {/* <RkText rkType='header6 primary'>个人信息</RkText> */}
          {/* </View> */}
          <View style={styles.row}>
            <RkTextInput
              label="姓名"
              value={this.state.userName}
              rkType="right clear"
              onChangeText={this.onUserNameInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="电子邮件"
              value={this.state.email}
              onChangeText={this.onEmailInputChanged}
              rkType="right clear"
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="电话"
              value={this.state.phone}
              onChangeText={this.onPhoneInputChanged}
              rkType="right clear"
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="电话2"
              value={this.state.secondPhone}
              onChangeText={this.onSecondPhoneInputChanged}
              rkType="right clear"
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType="primary header6">修改密码</RkText>
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="旧密码"
              value={this.state.password}
              rkType="right clear"
              secureTextEntry
              onChangeText={this.onPasswordInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="新密码"
              value={this.state.newPassword}
              rkType="right clear"
              secureTextEntry
              onChangeText={this.onNewPasswordInputChanged}
            />
          </View>
          <View style={styles.row}>
            <RkTextInput
              label="再输入一遍新密码"
              value={this.state.confirmPassword}
              rkType="right clear"
              secureTextEntry
              onChangeText={this.onConfirmPasswordInputChanged}
            />
          </View>
        </View>
        <View style={styles.section} />
        <GradientButton
          rkType="large"
          style={styles.button}
          text="保存"
          onPress={this.onSaveBtnClicked}
        />
      </RkAvoidKeyboard>
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: "center"
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32
  }
}));
