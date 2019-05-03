import React from "react";
import { AppLoading, Asset, Font, Icon } from "expo";

import AppNavigator from "./navigation/appNavigator";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { StatusBar, SafeAreaView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    console.disableYellowBox = true;

    await Font.loadAsync({
      // Roboto: require("native-base/Fonts/Roboto.ttf"),
      // Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <StatusBar hidden={true} />
            <AppNavigator />
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}
