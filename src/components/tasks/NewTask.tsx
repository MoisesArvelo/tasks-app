"use client";
import Button from "react-bootstrap/Button";
import ModalComponent, { ModalComponentHandle } from "../modal";
import { useRef } from "react";

const NewTask = () => {
  const modalRef = useRef<ModalComponentHandle>(null);

  return (
    <>
      <Button
        as="a"
        onClick={() => modalRef.current?.show("create")}
        variant="success"
        className="mx-3"
      >
        New Task
      </Button>
      <ModalComponent ref={modalRef} />
    </>
  );
};

export default NewTask;
