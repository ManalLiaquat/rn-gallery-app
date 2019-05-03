export default (state = {}, action) => {
  switch (action.type) {
    case "UPLOAD_PHOTO":
      return { ...state, imageURI: action.remoteUri };

    default:
      return state;
  }
};
