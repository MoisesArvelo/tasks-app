"use client";
import { signOut } from "next-auth/react";
import Button from "react-bootstrap/Button";

const Logout = () => {
  return (
    <Button onClick={() => signOut()} as="a" variant="primary">
      Log out
    </Button>
  );
};

export default Logout;
