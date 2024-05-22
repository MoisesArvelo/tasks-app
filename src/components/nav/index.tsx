"use client";
import { Container, Navbar } from "react-bootstrap";
import Logout from "../auth/logout";
import NewTask from "../tasks/NewTask";

const NavComponent = () => {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Tasks App</Navbar.Brand>

        <div>
          <NewTask />
          <Logout />
        </div>
      </Container>
    </Navbar>
  );
};

export default NavComponent;
