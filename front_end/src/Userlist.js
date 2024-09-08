import React, { useState, useEffect } from "react";
import { Table, Container, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const currentUser = localStorage.getItem("UserEmail");
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      window.alert("No login, please login.");
      navigate("/Login");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4200/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchData();
  });
  const handleEdit = (user) => {
    setEditUser(user);
    setEditedName(user.Fullname);
    setEditedEmail(user.Email);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this user ${userId}`
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:4200/deleteuser/${userId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const handleEditSave = async () => {
    const updatedUsers = users.map((user) =>
      user.id === editUser.id
        ? { ...user, Fullname: editedName, Email: editedEmail }
        : user
    );

    const EdiUuser = {
      Fullname: editedName,
      Email: editedEmail,
    };

    try {
      const response = await fetch(
        `http://localhost:4200/updateuser/${editUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify(EdiUuser),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setUsers(updatedUsers);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  const handleClose = () => setShowEditModal(false);
  return (
    <Container className="mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              const isDeleteDisabled = user.Email === currentUser;
              return (
                <tr key={user.id}>
                  <td>{user.Fullname}</td>
                  <td>{user.Email}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                      className="ml-2"
                      disabled={isDeleteDisabled}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Userlist;
