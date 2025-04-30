
import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./layouts/Admin.jsx";
import Login from "login/Login";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Switch>
    <Route exact path="/" render={(props) => <Login {...props} />} />
    <Route path="/dashboard" render={(props) => <AdminLayout {...props} />} />
    </Switch>
  </BrowserRouter>
);
