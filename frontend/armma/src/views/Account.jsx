import React, { useState } from "react";
import 'chartist/dist/chartist.min.css'; 
import * as Components from "../layouts/Components";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Card,
  Nav,
  Row,
  Col,
  Modal,
  Dropdown,
  Form,
  Button
} from "react-bootstrap";
import { API_CLOSE_ACCOUNT_URL, API_ADD_BALANCE_URL } from "../api_routes"; // Ensure this URL is correctly set

export default function Account({ account, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [amount, setAmount] = useState("");
  const history = useHistory();

  const handleCloseAccount = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post(API_CLOSE_ACCOUNT_URL, {
      account_id: account.id
    }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      console.log("Account closed:", response.data);
      setShowCloseModal(false);
      onClose(account.id); // Call onClose to update the account list
    })
    .catch(error => {
      console.error("There was an error closing the account!", error);
    });
  };

  const handleAddMoney = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Validate the amount to be positive
    if (parseFloat(amount) <= 0) {
      alert("Please enter a positive amount.");
      return;
    }

    axios.post(API_ADD_BALANCE_URL, {
      account_id: account.id,
      amount: parseFloat(amount)
    }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      console.log("Money added:", response.data);
      setShowModal(false);
      // Update the account balance in the UI
      account.balance += parseFloat(amount);
      setAmount(""); // Reset amount
    })
    .catch(error => {
      console.error("There was an error adding money to the account!", error);
    });
  };

  const handleTransfer = () => {
    history.push({
      pathname: '/dashboard/transfer',
      state: { fromIban: account.iban }
    });
  };

  return (
    <Col lg="4" sm="6">
      <Card className="card-stats">
        <Card.Body style={{ position: 'relative' }}>
          <Row>
            <Col xs="6">
              <div className="numbers">
                <p className="card-category" style={{ textAlign: 'center' }}>Account Name</p>
                <Card.Title as="h4" style={{ textAlign: 'center' }}>{account.account_name}</Card.Title>
              </div>
            </Col>
            <Col xs="4">
              <div className="numbers">
                <p className="card-category" style={{ textAlign: 'center' }}>Money</p>
                <Card.Title as="h4" style={{ textAlign: 'center' }}>{account.balance}</Card.Title>
              </div>
            </Col>
            <Col xs="2">
              <Dropdown>
                <Dropdown.Toggle
                  as={Nav.Link}
                  style={{
                    color: '#074168',
                    zIndex: 1000,
                    marginLeft: 0,
                    left: '0px',
                    width: '20px'
                  }}
                >
                  <i style={{
                    color: '#074168',
                    textAlign: 'left',
                    position: 'absolute',
                    right: '0px',
                    left: '0px',
                  }}
                    className="bi bi-gear-fill" ></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#"
                    onClick={() => setShowCloseModal(true)}
                  >
                    Close Account
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <div className="numbers">
                <p className="card-category" style={{ textAlign: 'center' }}>IBAN</p>
                <Card.Title as="h4" style={{ textAlign: 'center' }}>{account.iban}</Card.Title>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <hr></hr>
        <Row>
          <Col xs="6">
            <div className="numbers">
              <Components.Button onClick={() => setShowModal(true)} style={{ padding: '12px 20px', backgroundColor: '#314b5e', marginLeft: '30px' }} > Add money</Components.Button>
            </div>
          </Col>
          <Col xs="4">
            <div className="numbers">
              <Components.GhostButton onClick={handleTransfer} style={{ padding: '12px 20px', marginLeft: '20px', marginBottom: '20px', borderColor: '#314b5e' }}><span style={{ color: '#314b5e' }}>Transfer</span></Components.GhostButton>
            </div>
          </Col>
          <Modal
            className="modal-large"
            show={showModal}
            onHide={() => setShowModal(false)}
            style={{
              width: '400px',
              maxWidth: '100%',
              margin: '1.75rem auto',
              marginLeft: '40%'
            }}
          >
            <Modal.Body className="text-center" style={{ width: '100%' }}>
              <Form style={{ width: '100%' }} id="moneyForm" onSubmit={handleAddMoney}>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Insert money amount</label>
                      <Row>
                        <Col md="12" style={{ marginBottom: '10px' }}>
                          <Form.Control
                            placeholder="IBAN"
                            type="text"
                            disabled
                          ></Form.Control>
                        </Col>
                        <Col md="4" style={{ marginBottom: '10px' }}>
                          <Form.Control
                            placeholder="CVV"
                            type="number"
                            disabled
                          ></Form.Control>
                        </Col>
                        <Col md="12">
                          <Form.Control
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                          ></Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <div className="modal-footer">
              <Components.GhostButton
                className="btn-simple"
                type="button"
                variant="link"
                onClick={() => setShowModal(false)}
              >
                Back
              </Components.GhostButton>
              <Components.Button
                className="btn-fill pull-right"
                type="submit"
                variant="info"
                form="moneyForm"
              >
                Confirm
              </Components.Button>
            </div>
          </Modal>

          <Modal
            className="modal-large"
            show={showCloseModal}
            onHide={() => setShowCloseModal(false)}
            style={{
              width: '400px',
              maxWidth: '100%',
              margin: '1.75rem auto',
              marginLeft: '40%'
            }}
          >
            <Modal.Body className="text-center" style={{ width: '100%' }}>
              <Form style={{ width: '100%' }} id="closeAccountForm" onSubmit={handleCloseAccount}>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Are you sure you want to close this account?</label>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <div className="modal-footer">
              <Components.GhostButton
                className="btn-simple"
                type="button"
                variant="link"
                onClick={() => setShowCloseModal(false)}
              >
                Cancel
              </Components.GhostButton>
              <Components.Button
                className="btn-fill pull-right"
                type="submit"
                variant="danger"
                form="closeAccountForm"
              >
                Close Account
              </Components.Button>
            </div>
          </Modal>
        </Row>
      </Card>
    </Col>
  );
}