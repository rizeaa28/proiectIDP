
import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Nav } from "react-bootstrap";

import logo from "../../../assets/img/armmalogo.png";
import * as Components from "../../Components";


function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
          className="sidebar-background"
          style={{
            backgroundColor: "#0b5e98"
          }}
        />

      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img src={logo} alt="..." />
            </div>
          </a>
          <Components.H4Text>ARMMA Bank</Components.H4Text>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
