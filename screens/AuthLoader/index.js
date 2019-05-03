import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { connect } from "react-redux";
import { updateUser, removeUser } from "../../redux/actions/authActions";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      location: null
    };
  }

  static getDerivedStateFromProps(props) {
    console.log("IsUser ==>", props.user ? "YES" : "NO");
    return { user: props.user };
  }

  checkUser() {
    const { user } = this.state;
    if (user) {
      // console.log("*****USER*****", user);

      this.props.navigation.navigate("Main");
    } else {
      // console.log("*****NOT SIGNED IN*****");
      this.props.navigation.navigate("Auth");
    }
  }

  componentDidMount() {
    // this.props.removeUser();
    this.props.updateUser();
    this.checkUser();
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#f66" />
        <StatusBar backgroundColor="red" barStyle="light-content" />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducers.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: user => dispatch(updateUser(user)),
    removeUser: () => dispatch(removeUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
