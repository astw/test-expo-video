import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { RkText, RkButton } from "react-native-ui-kitten";

import { FontAwesome } from "../../assets/icons";

export const CameraButton = props => {
  //   navigate = () => {
  //     props.navigation.navigate("PhotoViewer");
  //   };

  return (
    <TouchableOpacity style={[styles.cameraBtn]}>
      <View>
        <RkButton
          rkType="clear"
          style={styles.buttonSection}
          onPress={props.onPress}
        >
          <RkText rkType="awesome hintColor" style={styles.cameraIconBtn}>
            {props.image}
          </RkText>
        </RkButton>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cameraBtn: {
    padding: 5
  },

  cameraIconBtn: {
    fontSize: 36,
    alignSelf: "flex-end",
    marginRight: 20
  },

  buttonSection: {
    flexDirection: "column"
  }
});
