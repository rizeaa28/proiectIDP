import React from "react";
import ReactDOM from "react-dom";
import * as Components from "./Components";
import "./styles.css";
import Grid from '@mui/material/Grid';
import logo from './assets/logo1.png';
import { API_REGISTER_URL } from "api_routes";
import axios from 'axios';
import { API_LOGIN_URL } from "api_routes";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function App() {
  const [signIn, toggle] = React.useState(true);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  // Debug form input -------------------------------------------
  const handleFormSubmitRegister = (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target); 
    const formValues = Object.fromEntries(formData.entries()); 

    console.log('Form data:', formValues);

    axios.post(API_REGISTER_URL, { // TODO: Handle existent user error
      username: formValues.email,
      password: formValues.password,
      real_name: formValues.name 
    })
    .then((response) => {
      console.log(response)
      toggle(true);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }

  const handleFormSubmitLogin = (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target); 
    const formValues = Object.fromEntries(formData.entries()); 

    console.log('Form data:', formValues);

    axios.post(API_LOGIN_URL, { // TODO: Handle wrong credentials error
      username: formValues.email,
      password: formValues.password,
    })
    .then(function (response)  {
      console.log(response.data.access_token)  // TODO: Unsafe log

      localStorage.setItem("token", response.data.access_token)
      
      console.log("Logged in successfully.");

      setShouldRedirect(true);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  };

  if (localStorage.getItem("token") !== null && !shouldRedirect) {
    setShouldRedirect(true);
  }

  return (
    <div className="old_body">
    {shouldRedirect && <Redirect to="/dashboard/accounts" />}
    <Grid container spacing={0}>
      <Grid item xs={5}>
        <Item>
        <img src={logo} alt="Phone image" className="responsive-img"/>
        </Item>
      </Grid>
      <Grid item xs={7}>
        <Item>
          <Components.Container>
            <Components.SignUpContainer signingIn={signIn}>
              <Components.Form onSubmit={handleFormSubmitRegister}>
                <Components.Title>Create Account</Components.Title>
                <Components.Input type="text" name="name" placeholder="Name" />
                <Components.Input type="email" name="email" placeholder="Email" />
                <Components.Input type="password" name="password" placeholder="Password" />
                <Components.Button type="submit">Sign Up</Components.Button>
              </Components.Form>
            </Components.SignUpContainer>
            <Components.SignInContainer signingIn={signIn}>
              <Components.Form onSubmit={handleFormSubmitLogin}>
                <Components.Title>Sign in</Components.Title>
                <Components.Input type="email" name="email" placeholder="Email" />
                <Components.Input type="password" name="password" placeholder="Password" />
                <Components.Button type="submit">Sign In</Components.Button>
              </Components.Form>
            </Components.SignInContainer>
            <Components.OverlayContainer signingIn={signIn}>
              <Components.Overlay signingIn={signIn}>
                <Components.LeftOverlayPanel signingIn={signIn}>
                  <Components.Title>Welcome Back!</Components.Title>
                  <Components.Paragraph>
                    To keep connected with us please login with your personal info
                  </Components.Paragraph>
                  <Components.GhostButton onClick={() => toggle(true)}>
                    Sign In
                  </Components.GhostButton>
                </Components.LeftOverlayPanel>
                <Components.RightOverlayPanel signingIn={signIn}>
                  <Components.Title>Hello, Friend!</Components.Title>
                  <Components.Paragraph>
                    Enter your personal details and start journey with us
                  </Components.Paragraph>
                  <Components.GhostButton onClick={() => toggle(false)}>
                    Sign Up
                  </Components.GhostButton>
                </Components.RightOverlayPanel>
              </Components.Overlay>
            </Components.OverlayContainer>
          </Components.Container>
        </Item>
      </Grid>
      
    </Grid>
    
    </div>
  );
}

const Item = ({ children }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    {children}
  </div>
);

