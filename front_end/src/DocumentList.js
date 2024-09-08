import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DocumentList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileDescription, setNewFileDescription] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = localStorage.getItem("UserEmail");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4200/docs");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const Data = await response.json();
      setFiles(Data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (currentUser === "" || currentUser === null) {
      window.alert("No login, please login.");
      navigate("/Login");
      return;
    }

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const handleUploadFile = async () => {
    if (uploadFile) {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const newFile = {
        name: Date.now() + "-" + uploadFile.name,
        description: newFileDescription,
      };

      formData.append("description", newFileDescription);
      formData.append("name", newFile.name);

      console.log(uploadFile);
      const doc = [...files, newFile];

      try {
        const response = await axios.post(
          "http://localhost:4200/adddoc",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setFiles(doc);
        setUploadFile(null);
        setShowAddModal(false);
        setErrorMessage("");
      } catch (error) {
        console.error("Error adding chat:", error);
      }
    }
  };

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setNewFileName(file.name);
    setNewFileDescription(file.description);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!newFileName) {
      setErrorMessage("File name cannot be empty");
      return;
    }
    setFiles(
      files.map((file) =>
        file.id === selectedFile.id
          ? { ...file, name: newFileName, description: newFileDescription }
          : file
      )
    );

    const Editdoc = {
      description: newFileDescription,
    };
    try {
      const response = await fetch(
        `http://localhost:4200/updatedoc/${selectedFile.id}`,
        {
          method: "PUT",
          body: JSON.stringify(Editdoc),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setShowEditModal(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleDeleteFile = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const response = await fetch(`http://localhost:4200/deletedoc/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setFiles(files.filter((file) => file.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setErrorMessage("");
  };

  return (
    <Container className="mt-5">
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)}
      >
        + Add Upload
      </Button>

      {files.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{file.description}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditFile(file)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info" className="mt-3">
          No files uploaded yet.
        </Alert>
      )}

      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit File Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formFileName">
              <Form.Label>File Name</Form.Label>
              <Form.Control
                type="text"
                disabled="true"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFileDescription">
              <Form.Label>File Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newFileDescription}
                onChange={(e) => setNewFileDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add File Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formFileDescription">
              <Form.Label>File Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newFileDescription}
                onChange={(e) => setNewFileDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFileUpload">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleUploadFile}
            disabled={!uploadFile}
            className="mt-2"
          >
            Upload
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DocumentList;
