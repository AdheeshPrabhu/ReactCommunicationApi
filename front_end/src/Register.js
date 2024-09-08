import React, { useState } from "react";
import "./Common.css";
import { Container } from "react-bootstrap";
import RegisterSuccess from "./RegisterSuccess";
const Register = () => {
  const [Fullname, setFullname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConPassword, setconPassword] = useState("");
  const [errors, setErrors] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = async () => {
    let errors = "";
    if (Fullname === "") {
      errors = "Please enter Full Name.";
    } else if (Email === "") {
      errors = "Please enter email id.";
    } else if (Password === "") {
      errors = "Please enter password.";
    } else if (Password.length < 6) {
      errors = "password Length should be grater than 6.";
    } else if (ConPassword === "") {
      errors = "Please enter confirm Password.";
    } else if (ConPassword.length < 6) {
      errors = "Confirm Password  Length should be grater than 6.";
    } else if (Password !== ConPassword) {
      errors = "Passwoard and confirm password not match.";
    } else if (errors.length === 0) {
      try {
        // User API call for validation
        const response = await fetch("http://localhost:4200/users");
        const data = await response.json();
        const userExists = data.some((user) => user.Email === Email); // Adjust based on your data structure

        if (userExists) {
          errors = "User already exists.";
        }
      } catch (er) {
        errors = `Failed to check user existence. ${er} `;
      }
      if (errors.length > 0) {
        setErrors(errors);
      }
    }
    
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let er = await validateForm();
    console.log({ er });
    if (er.length === 0) {
      try {
        const user = {
          Fullname,
          Email,
          Password,
        };
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
      setErrors(er);
    }
  };

  return isSuccess ? (
    <RegisterSuccess />
  ) : (
    <Container>
      <div className ="lgfrm" > <h3>Register Form Validation</h3> </div>
      
      <form className="col-xxl-6 regfrm" onSubmit={handleSubmit}>
        Enter Username:{" "}
        <input
          type="text"
          name="FullName"
          className="form-control"
          placeholder="enter Name"
          value={Fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        Enter EmailID:{" "}
        <input
          type="email"
          name="Eamil"
          className="form-control"
          placeholder="enter Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        Enter Password:{" "}
        <input
          type="password"
          name="Password"
          className="form-control"
          placeholder="enter password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        Enter Password:{" "}
        <input
          type="password"
          name="ConPassword"
          className="form-control"
          placeholder="enter confirm password"
          value={ConPassword}
          onChange={(e) => setconPassword(e.target.value)}
        />
        <p className="errorcolur">{errors}</p>
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
