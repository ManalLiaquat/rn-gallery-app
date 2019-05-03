import { firebase, DB } from "../../config/firebase";

const updateUser = (updatedUser = null) => {
  return dispatch => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("*** USER LOGIN HAI - [ACTIONS] ***");
        DB.child(`/users/${user.uid}`).on("value", data => {
          if (data.val()) {
            dispatch({
              type: "UPDATE_USER",
              user: data.val()
            });
          } else {
            const myUser = {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid,
              gallery: []
            };
            setUser(myUser);
            dispatch({
              type: "UPDATE_USER",
              user: updatedUser || myUser
            });
          }
          // console.log(data.val(), "data")
        });
      } else {
        console.log("*** USER IS NOT LOGGED IN - [ACTIONS] ***");
        dispatch({
          type: "REMOVE_USER"
        });
      }
    });
  };
};

// const updateUser = params => {
//   return dispatch => {
//     dispatch({
//       type: "UPDATE_USER",
//       user: { uid: "lPdij2283sM9171A1kjDa8", displayName: "maaan" }
//     });
//   };
// };

const setUser = user => {
  return dispatch => {
    console.log("setuser ********** ", user);

    DB.child(`/users/${user.uid}`)
      .set(user)
      .then(() => {
        dispatch({
          type: "UPDATE_USER",
          user
        });
      });
  };
};

const removeUser = () => {
  return dispatch => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({
          type: "REMOVE_USER"
        });
      });
  };
};

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        return true;
      }
    }
  }
  return false;
}

const onSignIn = googleUser => {
  return dispatch => {
    // console.log("Google Auth Response", googleUser);
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(result => {
            // console.log("action result => ", result);
            const user = {
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              uid: result.user.uid,
              gallery: []
            };
            updateUser(user);
            setUser(user);
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };
};

export { updateUser, removeUser, setUser, onSignIn };
