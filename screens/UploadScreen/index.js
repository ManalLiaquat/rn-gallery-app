import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { ImagePicker, Permissions, Notifications } from "expo";
import AwesomeButton from "react-native-really-awesome-button/src/themes/blue";
import { uploadPhoto } from "../../redux/actions/uploadActions";
import { setUser, removeUser } from "../../redux/actions/authActions";

class UploadScreen extends Component {
  state = {
    isGranted: false,
    imageURI: "",
    user: null
  };

  takePickture = async next => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      console.log("result", result);
      this.props.uploadPhoto(result.uri);
      setTimeout(() => {
        next();
      }, 5000);
    }
    next();
  };

  choosePicture = async next => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      console.log("result", result);
      this.props.uploadPhoto(result.uri);
      setTimeout(() => {
        next();
      }, 5000);
    }
    next();
  };

  getPermissions = async () => {
    const res1 = await Permissions.askAsync(Permissions.CAMERA);
    const res2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (res1.status === "granted" && res2.status === "granted") {
      this.setState({ isGranted: true });
    } else {
      throw new Error("Location permission not granted");
    }

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
  };

  storeInDB = imageURI => {
    var { user } = this.state;
    if ("gallery" in user) {
      user.gallery.push(imageURI);
    } else {
      user.gallery = [];
      user.gallery.push(imageURI);
    }
    this.props.setUser(user);
  };

  sendPushNotification = async () => {
    let token = await Notifications.getExpoPushTokenAsync();
    fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: token,
        body: `Photo is uploaded`
      })
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.imageURI !== this.props.imageURI) {
      // this.setState({ imageURI: this.props.imageURI });
      console.log("image uri ", this.props.imageURI);
      this.storeInDB(this.props.imageURI);

      this.sendPushNotification();
    }
  };

  componentDidMount = async () => {
    this.getPermissions();
  };

  static getDerivedStateFromProps(props, state) {
    return { user: props.user };
  }

  render() {
    const { isGranted, user } = this.state;
    // console.log(user);

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-evenly"
        }}
      >
        {/* <Text>Upload Screen</Text> */}
        {isGranted && (
          <AwesomeButton
            progress
            // raiseLevel={3}
            onPress={next => {
              this.takePickture(next);
            }}
            type="primary"
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
          >
            <Avatar.Icon
              style={{ margin: 10, backgroundColor: "white" }}
              icon="camera"
              size={25}
            />
            <Text style={{ marginRight: 10, color: "white" }}>
              Take Picture
            </Text>
          </AwesomeButton>
        )}
        <AwesomeButton
          // raiseLevel={3}
          progress
          onPress={next => {
            this.choosePicture(next);
          }}
          type="secondary"
          style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
        >
          <Avatar.Icon
            style={{ margin: 10, backgroundColor: "white" }}
            icon="cloud-upload"
            size={25}
          />
          <Text style={{ marginRight: 10 }}>Select from gallery</Text>
        </AwesomeButton>
        <AwesomeButton
          progress
          onPress={next => {
            this.props.navigation.navigate("Auth");
            next();
            setTimeout(() => {
              this.props.removeUser();
            }, 2000);
          }}
        >
          Logout
        </AwesomeButton>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  imageURI: state.uploadReducers.imageURI,
  user: state.authReducers.user
});

const mapDispatchToProps = dispatch => ({
  uploadPhoto: (uri, folderName) => dispatch(uploadPhoto(uri, folderName)),
  setUser: user => dispatch(setUser(user)),
  removeUser: () => dispatch(removeUser())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadScreen);
