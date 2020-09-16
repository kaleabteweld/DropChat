const were_now = (
  state = {
    loc: "post",
  },
  action
) => {
  switch (action.type) {
    case "ch_view":
      return {
        loc: action.playload.to,
      };
      break;

    default:
      return state;
      break;
  }
};

export default were_now;
