import React, { useState } from "react";
import "./Common.css";
import { Container } from "react-bootstrap";
import RegisterSuccess from "./RegisterSuccess";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = async () => {
    let errorMessages = "";

    if (fullname.trim() === "") {
      errorMessages = "Please enter Full Name.";
    } else if (email.trim() === "") {
      errorMessages = "Please enter email id.";
    } else if (password === "") {
      errorMessages = "Please enter password.";
    } else if (password.length < 6) {
      errorMessages = "Password length should be greater than 6.";
    } else if (conPassword === "") {
      errorMessages = "Please enter confirm password.";
    } else if (conPassword.length < 6) {
      errorMessages = "Confirm Password length should be greater than 6.";
    } else if (password !== conPassword) {
      errorMessages = "Password and confirm password do not match.";
    } else {
      try {
        const response = await fetch("http://localhost:4200/users");
        const data = await response.json();
        const userExists = data.some((user) => user.email === email);
        if (userExists) {
          errorMessages = "User already exists.";
        }
      } catch (error) {
        errorMessages = `Failed to check user existence. ${error}`;
      }
    }

    return errorMessages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = await validateForm();
    if (formErrors === "") {
      try {
        const user = { fullname, email, password };
        const response = await fetch("http://localhost:4200/addUser", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setErrors("");
        setIsSuccess(true);
      } catch (error) {
        setErrors(`Failed to register user. ${error}`);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return isSuccess ? (
    <RegisterSuccess />
  ) : (
    <Container>
      <h1>Register Form Validation</h1>
      <form className="col-xxl-6" onSubmit={handleSubmit}>
        <div>
          <label>Enter Full Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div>
          <label>Enter Email ID:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Enter Password:</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={conPassword}
            onChange={(e) => setConPassword(e.target.value)}
          />
        </div>
        <p className="errorcolor">{errors}</p>
        <input
          className="btn btn-outline-secondary ml-2"
          type="submit"
          value="Register"
        />
      </form>
    </Container>
  );
};

export default Register;
