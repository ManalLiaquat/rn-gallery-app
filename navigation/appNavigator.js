import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./mainTabNavigator";
import AuthLoadingScreen from "../screens/AuthLoader";
import LoginScreen from "../screens/LoginScreen";

const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoader: AuthLoadingScreen,
      Main: MainTabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoader"
    }
  )
);
