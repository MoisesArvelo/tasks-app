import { useMemo, useRef, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useSession } from "next-auth/react";
import TaskProvider from "../http/tasks";
import capitalize from "capitalize";
import ModalComponent, { ModalComponentHandle } from "../modal";

const TaskItem = ({ _id, title, flag, description, marked_as_done }: any) => {
  const { data: session } = useSession();

  const taskProvider = new TaskProvider(
    session?.user?.account?.access_token ?? "",
  );

  const [done, setDone] = useState(marked_as_done);
  const modalRef = useRef<ModalComponentHandle>(null);

  const color_state = useMemo(
    () =>
      done
        ? "success"
        : flag === "normal"
          ? "primary"
          : flag === "priority"
            ? "warning"
            : flag === "urgent"
              ? "danger"
              : "primary",
    [flag, done],
  );

  const check = () =>
    taskProvider
      .check(_id, done)
      .then((res: any) => setDone(res.payload.marked_as_done));

  const drop = () =>
    taskProvider.drop(_id).then((res: any) => {
      if (res.success) {
        window.location.reload();
      }
    });

  return (
    <>
      <Col sm="12" lg="4" xxl="3">
        <Card
          border={color_state}
          text={"dark"}
          className="my-2 mx-2"
          style={{ height: 200, overflow: "hidden" }}
        >
          <Card.Header
            className={`bg-${color_state}-subtle text-${color_state}-emphasis d-flex justify-content-between align-items-center fw-bold`}
          >
            <div>{capitalize(flag === "normal" ? "regular" : flag)}</div>
            <div className="d-flex">
              <Button
                onClick={check}
                variant={done ? "info" : "success"}
                className="mx-1 d-flex align-items-center justify-content-center"
              >
                <i
                  className={`bi ${done ? "bi-reply-fill text-white" : "bi-check-lg"}`}
                ></i>
              </Button>
              <Button
                onClick={() => modalRef.current?.show("update", _id)}
                variant="primary"
                className="mx-1 d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-pen-fill" style={{ fontSize: 12 }}></i>
              </Button>
              <Button
                onClick={drop}
                variant="danger"
                className="mx-1 d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-trash-fill" style={{ fontSize: 12 }}></i>
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <ModalComponent ref={modalRef} />
    </>
  );
};

export default TaskItem;
