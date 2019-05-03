import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, TouchableOpacity, FlatList } from "react-native";
import { Text } from "expo";
import Gallery from "react-native-image-gallery";
import { removeUser } from "../../redux/actions/authActions";

export class GalleryScreen extends Component {
  state = {
    user: null,
    startingIndex: 0,
    showSlider: false,
    sliderArr: [],
    isUserGallery: false
  };

  static getDerivedStateFromProps(props, state) {
    if (typeof props.user === "object") {
      if (!("gallery" in props.user)) {
        props.user.gallery = [];
        return { user: props.user, isUserGallery: false };
      } else {
        return { user: props.user, isUserGallery: true };
      }
    }
  }

  makeSliderArr = () => {
    var { user, sliderArr } = this.state;
    sliderArr = [];
    if (typeof this.props.user === "object") {
      if ("gallery" in this.props.user) {
        user.gallery.map(uri => {
          sliderArr.push({ source: { uri } });
        });
      }
    }
    this.setState({ sliderArr });
    // if ("gallery" in user) {
    // }
  };

  componentDidMount = () => {
    this.setState({ user: this.props.user });
    if (this.state.user) {
      this.makeSliderArr();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.user !== this.props.user) {
      this.setState({ user: this.props.user });
      this.makeSliderArr();
    }
  };

  render() {
    const {
      user,
      showSlider,
      sliderArr,
      startingIndex,
      isUserGallery
    } = this.state;

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        {!showSlider ? (
          isUserGallery && (
            <FlatList
              keyExtractor={(item, index) => item.key}
              numColumns={3}
              data={user.gallery}
              renderItem={obj => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      startingIndex: obj.index,
                      showSlider: true
                    });
                  }}
                >
                  <Image
                    source={{ uri: obj.item }}
                    style={{
                      width: 100,
                      height: 100,
                      margin: 5,
                      borderRadius: 5
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          )
        ) : (
          <Gallery
            style={{ flex: 1, backgroundColor: "black" }}
            initialPage={startingIndex}
            flatListProps={{ windowSize: 3 }}
            images={sliderArr}
            onSingleTapConfirmed={() => {
              this.setState({ showSlider: false });
            }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducers.user
});

const mapDispatchToProps = disptch => ({
  removeUser: () => disptch(removeUser())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryScreen);
