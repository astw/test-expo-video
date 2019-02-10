import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  ToastAndroid,
  CameraRoll,
  PermissionsAndroid
} from "react-native";

import { RkText, RkButton, RkStyleSheet } from "react-native-ui-kitten";


import { ImagePicker } from 'expo';
import { Gallery } from "../../components";

export class PhotoViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      photos: [],
    };
  }

  loadPhotos = () => {
    return CameraRoll.getPhotos({
      first: 2,
      assetType: "Photos",
      mimeTypes: ["image/jpeg"]
    }).then(r => {
      let photos = r.edges.map(i => i.node.image);
      return photos;
    });
  };

  async componentDidMount() {

    await this._pickImage();


    // this.loadPhotos()
    //   .then(photos => {
    //     console.log(photos);
    //     this.setState({ photos });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }


  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };


  render = () => (
    <ScrollView style={styles.root}>
      <Gallery items={this.state.photos} />
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    paddingTop: 25,
    paddingBottom: 17
  },
  row: {
    flexDirection: "row"
  },
  userInfo: {
    flexDirection: "row",
    paddingVertical: 18
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base
  },
  section: {
    flex: 1,
    alignItems: "center"
  },
  space: {
    marginBottom: 3
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: "center",
    flexDirection: "row",
    flex: 0,
    width: 1,
    height: 42
  },
  buttons: {
    flex: 1
  },
  button: {
    marginTop: 27.5,
    alignSelf: "center"
  }
}));
