import React, { useState, useEffect } from "react";
import * as Components from "../layouts/Components";
import { API_USER_INFO_URL, API_UPDATE_PROFILE_URL } from "../api_routes";
import axios from "axios";
import { Card, Form, Container, Row, Col } from "react-bootstrap";

function User() {
  const [userData, setUserData] = useState({
    username: "",
    real_name: "",
    address: "",
    city: "",
    country: ""
  });
  const [passwords, setPasswords] = useState({
    new_password: "",
    repeat_password: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(API_USER_INFO_URL, { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => {
        setUserData(response.data.message);
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (passwords.new_password !== passwords.repeat_password) {
      alert("Passwords do not match!");
      return;
    }

    const updatedData = {
      ...userData,
      ...passwords
    };

    axios.post(API_UPDATE_PROFILE_URL, updatedData, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(response => {
        alert("Profile updated successfully!");
      })
      .catch(error => {
        console.error("There was an error updating the profile!", error);
      });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="7">
                      <Form.Group>
                        <label>Email</label>
                        <Form.Control
                          disabled
                          placeholder={userData.username}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="5">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          disabled
                          name="real_name"
                          placeholder="Username"
                          type="text"
                          value={userData.real_name}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Address</label>
                        <Form.Control
                          name="address"
                          placeholder="Home Address"
                          type="text"
                          value={userData.address}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control
                          name="city"
                          placeholder="City"
                          type="text"
                          value={userData.city}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          name="country"
                          placeholder="Country"
                          type="text"
                          value={userData.country}
                          onChange={handleInputChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Card.Title as="h4" style={{ margin: '15px 0px 0px 15px' }}>Change password</Card.Title>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>New password</label>
                        <Form.Control
                          name="new_password"
                          placeholder="New password"
                          type="password"
                          value={passwords.new_password}
                          onChange={handlePasswordChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Repeat password</label>
                        <Form.Control
                          name="repeat_password"
                          placeholder="Repeated password"
                          type="password"
                          value={passwords.repeat_password}
                          onChange={handlePasswordChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Components.Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                    style={{ marginTop: '10px' }}
                  >
                    Update Profile
                  </Components.Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </>
  );
}

export default User;