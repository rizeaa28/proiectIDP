import React, { useState, useEffect } from "react";
import 'chartist/dist/chartist.min.css'; 
import * as Components from "../layouts/Components";
import 'bootstrap/dist/css/bootstrap.min.css';
import Account from '../views/Account';
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { API_ACCOUNTS_URL, API_CREATE_ACCOUNT_URL, API_CLOSE_ACCOUNT_URL } from "../api_routes"; // Add API_CLOSE_ACCOUNT_URL

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(API_ACCOUNTS_URL, { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => setAccounts(response.data.message))
      .catch(error => console.error("There was an error fetching the accounts!", error));
  }, []);

  const handleAddAccount = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post(API_CREATE_ACCOUNT_URL, {
      account_name: newAccountName
    }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      console.log("Account added:", response.data);
      const newIBAN = response.data.iban;
      setShowModal(false);
      const token = localStorage.getItem("token");
      axios.get(API_ACCOUNTS_URL, { headers: { "Authorization": `Bearer ${token}` } })
        .then(response => setAccounts(response.data.message))
        .catch(error => console.error("There was an error fetching the accounts!", error));
    })
    .catch(error => {
      console.error("There was an error adding the account!", error);
    });
  };

  const handleCloseAccount = (accountId) => {
    const token = localStorage.getItem("token");
    axios.post(API_CLOSE_ACCOUNT_URL, {
      account_id: accountId
    }, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      console.log("Account closed:", response.data);
      setAccounts(accounts.filter(account => account.id !== accountId));
    })
    .catch(error => {
      console.error("There was an error closing the account!", error);
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs="12">
            <Components.Button onClick={() => setShowModal(true)} style={{ marginBottom: '20px', backgroundColor: '#314b5e', borderColor: '#314b5e' }}>Add account</Components.Button>
          </Col>
          {accounts.map(account => (
            <Account key={account.id} account={account} onClose={handleCloseAccount} />
          ))}
        </Row>
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
            <Form style={{ width: '100%' }} id="addAccountForm" onSubmit={handleAddAccount}>
              <Row>
                <Col className="pr-1" md="12">
                  <Form.Group>
                    <label>Account name</label>
                    <Form.Control
                      placeholder="Account name"
                      type="text"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      required
                    ></Form.Control>
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
              form="addAccountForm"
            >
              Confirm
            </Components.Button>
          </div>
        </Modal>
      </Container>
    </>
  );
}