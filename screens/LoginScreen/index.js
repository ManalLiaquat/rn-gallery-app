import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";
import { Google } from "expo";
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

import { connect } from "react-redux";
import { onSignIn } from "../../redux/actions/authActions";
import { ANDROID_KEY, IOS_KEY } from "../../constant/secretApiKey";

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      errorMessage: "",
      loader: false
    };
    this.logIn = this.logIn.bind(this);
  }

  static getDerivedStateFromProps(props) {
    return { user: props.user };
  }

  logIn = async next => {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_KEY,
        iosClientId: IOS_KEY,
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        // return result.accessToken;
        // console.log("result=> ", result);
        this.props.onSignIn(result);
        setTimeout(() => {
          next();
          this.props.navigation.navigate("Main");
        }, 3000);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <AwesomeButton
          progress
          onPress={next => {
            this.logIn(next);
            // next();
          }}
          type="youtube"
          // stretch={true}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <Avatar.Image
            style={{ margin: 10 }}
            source={require("../../assets/google.jpg")}
            size={25}
          />
          <Text style={{ margin: 10, color: "white" }}>SignIn with Google</Text>
        </AwesomeButton>

        {this.state.loader && <ActivityIndicator size={40} color="#f66" />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducers.user
  };
};

const mapDispatchToProps = dispatch => ({
  onSignIn: firebaseUser => dispatch(onSignIn(firebaseUser))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
