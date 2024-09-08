import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Welcome from "./Welcome";
import LoginSuccessful from "./LoginSuccessful";
import Login from "./Login";
import Userlist from "./Userlist";
import DocumentList from "./DocumentList";
import Logout from "./Logout";
import RegisterSuccess from "./RegisterSuccess";
import GroupChat from "./GroupChat";
class Main extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav />}>
            <Route path="Home" element={<Welcome />} />
            <Route path="GroupChat" element={<GroupChat />} />
            <Route path="Userlist" element={<Userlist />} />
            <Route path="DocumentList" element={<DocumentList />} />
            <Route path="Logout" element={<Logout />} />
             </Route>
          <Route>
            <Route path="Login" element={<Login />} />
            <Route path="LoginSuccessful" element={<LoginSuccessful />} />
            <Route path="RegisterSuccess" element={<RegisterSuccess />} />
            <Route path="Register" element={<Register />} />
            <Route path="Welcome" element={<Welcome />} />
           
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
export default Main;
