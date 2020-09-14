import React from "react";

import Nav from "./into_sub_com/nav";
import Head from "./into_sub_com/head";
import Portes from "./into_sub_com/portes";
import Get from "./into_sub_com/get";
import About from "./into_sub_com/about";
import Git from "./into_sub_com/git";
import Foot from "./into_sub_com/foot";

export default () => {
  return (
    <React.Fragment>
      <Nav />
      <Head />
      <Portes />
      <Get />
      <About />
      <Git />
      <Foot />
    </React.Fragment>
  );
};
