import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Common.css";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState();

  const validateForm = async () => {
    let errors = " ";
    if (!Email) errors = "Email is required";
    else if (!Password) errors = "Password is required";
    else if (Password.length < 6)
      errors = "Password must be at least 6 characters long";
    const response = await fetch("http://localhost:4200/users");
    const data = await response.json();
    const userExists = data.find(
      (user) => user.Email === Email && user.Password === Password
    ); // Adjust based on your data structure
    if (userExists) {
      localStorage.setItem("UserEmail", Email);
      localStorage.setItem("UserName", userExists.Fullname);
      return "";
    } else {
      errors = "User Not found !!";
      return errors;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForm();
    if (errors.length === 0) {
      navigate("/LoginSuccessful");

      setErrors("");

      console.log({ Email, Password });
    } else {
      setErrors(errors);
    }
  };

  return (
    <Container>
      <div className="lgfrm"> User Login </div>
      <form className="col-xxl-6 loginfrm" onSubmit={handleSubmit}>
        Enter Username:{" "}
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="enter email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        Enter Password:{" "}
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="enter password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="errorcolur">{errors}</p>
        <input
          className="btn btn-outline-secondary ml-2"
          type="submit"
          value="Login"
        />
      </form>
    </Container>
  );
};

export default Login;
