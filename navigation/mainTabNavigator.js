import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";

import UploadScreen from "../screens/UploadScreen";
import GalleryScreen from "../screens/GalleryScreen";

const AppTabs = createMaterialTopTabNavigator(
  {
    Upload: UploadScreen,
    Gallery: GalleryScreen
  },
  {
    initialRouteName: "Upload"
  }
);

// HomeStack.navigationOptions = ({ navigation }) => {
//   return {
//     tabBarIcon: ({ focused }) => (
//       <TabBarIcon
//         focused={focused}
//         name={
//           Platform.OS === "ios"
//             ? `ios-home${focused ? "" : "-outline"}`
//             : "md-home"
//         }
//       />
//     )
//   };
// };

export default AppTabs;
