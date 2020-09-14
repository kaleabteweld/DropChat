const authReducer = (
  state = {
    log_in: false,
    user_data: {},
    user_token: "",
  },
  action
) => {
  switch (action.type) {
    case "log_in":
      return {
        log_in: true,
        user_data: action.playload.data,
        user_token: action.playload.token,
      };
      break;
    case "log_out":
      return { log_in: false, user_data: {}, user_token: "" };
      break;

    default:
      return state;
      break;
  }
};

export default authReducer;
