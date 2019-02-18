import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  WebView,
  Platform,
  Button
} from "react-native";

import { Camera, Permissions } from "expo";

const { height, width } = Dimensions.get("window");
import { RkText, RkButton } from "react-native-ui-kitten";

import { FontAwesome } from "../../assets/icons";

export class VideoRecorder extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isRecording: false,
    mediaFile: undefined
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  goBack(params) {
    const { navigation } = this.props;
    navigation.setParams(params);
    navigation.goBack(null);
    navigation.state.params.goBack(params);
  }

  onCancelBtnPress = () => {
    this.camera.stopRecording();
    this.setState({
      isRecording: false
    });

    this.goBack(null);
  };

  onActionBtnPress = async () => {
    if (this.camera) {
      // let photo = await this.camera.takePictureAsync();
      const options = {
        maxDuration: 30
      };

      if (this.state.isRecording) {
        this.camera.stopRecording();
      } else {
        this.setState({
          isRecording: true
        });

        try {
          const video = await this.camera.recordAsync(options);
          this.setState({
            isRecording: false,
            mediaFile: video
          });
          this.camera.resumePreview();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  onToggleButtonPress = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  onUndoBtnPress = () => {
    this.camera.stopRecording();
    this.setState({
      mediaFile: undefined
    });
  };

  onSelectedBtnPress = () => {
    const params = { mediaFile: this.state.mediaFile };
    this.goBack(params);
  };

  renderToggleButton = () => {
    return (
      <View style={styles.toggleButtonBar}>
        <RkButton
          rkType="clear"
          style={styles.cameraSwitchBtn}
          onPress={this.onToggleButtonPress}
        >
          <Image
            style={styles.cameraSwitchBtn}
            source={require("../../assets/icons/camera-switch.png")}
          />
        </RkButton>
      </View>
    );
  };

  renderActionBar = () => {
    if (this.state.mediaFile) {
      //render after recorder bar
      return (
        <View style={styles.afterRecordBar}>
          <RkButton
            rkType="clear"
            backgroundColor="white"
            onPress={this.onUndoBtnPress}
          >
            <RkText rkType="awesome" style={[styles.afterRecordBtn]}>
              {FontAwesome.undo}
            </RkText>
          </RkButton>
          <RkButton rkType="clear" onPress={this.onSelectedBtnPress}>
            <RkText rkType="awesome" style={[styles.afterRecordBtn]}>
              {FontAwesome.check}
            </RkText>
          </RkButton>
        </View>
      );
    } else {
      //render before recorder bar
      return (
        <View style={styles.actionBar}>
          <RkText
            rkType="awesome hintColor"
            style={styles.cancelBtn}
            onPress={this.onCancelBtnPress}
          >
            {" "}
            {FontAwesome.cross}{" "}
          </RkText>

          <RkButton rkType="clear" onPress={this.onActionBtnPress}>
            <RkText rkType="awesome primary" style={styles.cameraIconBtn}>
              {this.state.isRecording
                ? FontAwesome.stopCircle
                : FontAwesome.solidCircle}
            </RkText>
          </RkButton>
        </View>
      );
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={[styles.container]}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            {this.renderToggleButton()}

            {this.renderActionBar()}
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    //left: 0,
    height: height,
    width: width,
    backgroundColor: "#f0f0f0",
    flex: 1,
    zIndex: 10000
  },

  cameraSwitchBtn: {
    width: 36,
    height: 36
  },

  cancelBtn: {
    fontSize: 48,
    position: "absolute",
    alignSelf: "flex-start",
    // marginLeft: 'auto',
    marginRight: 150
  },

  afterRecordBtn: {
    fontSize: 60,
    marginRight: 20,
    color: "green",
    margin: 10,
    padding: 80
  },

  afterRecordBar: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    width: width - 50,
    height: 80,
    margin: 25,
    backgroundColor:'red'
  },

  actionBtn: {
    width: 60,
    height: 60
  },
  actionBar: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    width: width - 50,
    height: 80,
    margin: 25
  },

  toggleButtonBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    marginTop: 30,
    marginRight: 30
  },

  cameraIconBtn: {
    fontSize: 80,
    alignSelf: "flex-end",
    marginRight: 20
  }
});
