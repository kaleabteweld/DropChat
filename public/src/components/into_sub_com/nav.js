import React from "react";
import $ from "jquery";

import "../css/into_sub_com/nav.css";

export default () => {
  function mune_init() {
    $('[href*="#"]').click(function () {
      if (
        window.location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        window.location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html, body").animate(
            { scrollTop: target.offset().top - 72 },
            1000
          );
          return false;
        }
      }
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scroll({
      target: "#nav",
      offset: 75,
    });
  }

  mune_init();

  return (
    <nav
      id="nav"
      className="navbar fixed-top navbar-dark bg-dark navbar-expand-lg"
    >
      <a className="navbar-brand" href="#">
        DropChat
      </a>
      <button
        className="navbar-toggler  navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item ">
            <a className="nav-link nav-link js-scroll-trigger" href="#body">
              Home
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link nav-link js-scroll-trigger" href="#portes">
              About DropTalk
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link nav-link js-scroll-trigger" href="#get">
              Download
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link nav-link js-scroll-trigger" href="#about">
              Devlopers
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link nav-link js-scroll-trigger" href="#join">
              Github
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
