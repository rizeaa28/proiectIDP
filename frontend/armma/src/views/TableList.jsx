import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Components from "../layouts/Components";
import { API_TRANSACTIONS_URL, API_USER_INFO_URL } from "../api_routes";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function TableList() {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch the current user
    axios.get(API_USER_INFO_URL, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      setCurrentUser(response.data.message);
    })
    .catch(error => {
      console.error("There was an error fetching the user info!", error);
    });

    // Fetch the transactions
    axios.get(API_TRANSACTIONS_URL, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      setTransactions(response.data.message);
    })
    .catch(error => {
      console.error("There was an error fetching the transactions!", error);
    });
  }, []);

  const formatAccountInfo = (user, account, isCurrentUser) => {
    return isCurrentUser ? `${user} (${account})` : user;
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title><Components.H4Text>My Transactions</Components.H4Text></Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">From</th>
                      <th className="border-0">To</th>
                      <th className="border-0">Amount</th>
                      <th className="border-0">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const isFromCurrentUser = currentUser && transaction.from_user === currentUser.real_name;
                      const isToCurrentUser = currentUser && transaction.to_user === currentUser.real_name;

                      return (
                        <tr key={transaction.id}>
                          <td>{transaction.id}</td>
                          <td>{formatAccountInfo(transaction.from_user, transaction.from_account, isFromCurrentUser) || transaction.from_iban}</td>
                          <td>{transaction.to_account === null ? transaction.to_iban : formatAccountInfo(transaction.to_user, transaction.to_account, isToCurrentUser) || transaction.to_iban}</td>
                          <td>{transaction.amount}</td>
                          <td>{new Date(transaction.transaction_time).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableList;