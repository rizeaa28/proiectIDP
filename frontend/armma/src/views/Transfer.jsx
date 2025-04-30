import React, { useState, useEffect } from "react";
import * as Components from "../layouts/Components";
import axios from "axios";
import { API_TRANSFER_BALANCE_URL } from "../api_routes";
import { useLocation } from "react-router-dom";

// react-bootstrap components
import {
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";

function Transfer() {
  const location = useLocation();
  const [fromIban, setFromIban] = useState("");
  const [toIban, setToIban] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (location.state && location.state.fromIban) {
      setFromIban(location.state.fromIban);
    }
  }, [location.state]);

  const handleTransfer = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validate the amount to be positive
    if (parseFloat(amount) <= 0) {
      alert("Please enter a positive amount.");
      return;
    }

    axios.post(API_TRANSFER_BALANCE_URL, {
      from_account: fromIban,
      to_account: toIban,
      amount: parseFloat(amount),
      reason: description
    }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      console.log("Transfer successful:", response.data);
      alert("Transfer successful!");
      // Reset form fields
      setFromIban("");
      setToIban("");
      setName("");
      setAmount("");
      setDescription("");
    })
    .catch(error => {
      if (error.response && error.response.data.message) {
        alert(`Transfer failed: ${error.response.data.message}`);
      } else {
        console.error("There was an error making the transfer!", error);
        alert("Transfer failed. Please try again.");
      }
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header></Card.Header>
              <Card.Body>
                <Card.Subtitle as="h3">From</Card.Subtitle>
                <Form onSubmit={handleTransfer}>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>IBAN</label>
                        <Form.Control
                          placeholder="IBAN"
                          type="text"
                          value={fromIban}
                          onChange={(e) => setFromIban(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Card.Subtitle as="h3" style={{ margin: '15px 0px 0px 15px' }}>To</Card.Subtitle>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>IBAN</label>
                        <Form.Control
                          placeholder="IBAN"
                          type="text"
                          value={toIban}
                          onChange={(e) => setToIban(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          placeholder="Name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Amount</label>
                        <Form.Control
                          placeholder="Value"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Description</label>
                        <Form.Control
                          cols="80"
                          placeholder="Description"
                          rows="4"
                          as="textarea"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
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
                    Send
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

export default Transfer;