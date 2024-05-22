"use client";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { TaskInterface } from "../interface/task.interface";
import { useSession } from "next-auth/react";
import TaskProvider from "../http/tasks";
import capitalize from "capitalize";
import { ThreeDots } from "react-loader-spinner";

export interface ModalComponentHandle {
  show: (operation: "create" | "update", _id?: string) => void;
}

const ModalComponent = forwardRef<ModalComponentHandle>(({}, ref) => {
  const { data: session } = useSession();
  const taskProvider = new TaskProvider(
    session?.user?.account?.access_token ?? "",
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operationType, setOperationType] = useState<"create" | "update">(
    "create",
  );
  const [task, setTask] = useState<TaskInterface>({
    _id: "",
    title: "",
    description: "",
    flag: "normal",
    marked_as_done: false,
  });
  const [taskErrors, setTaskErrors] = useState<{ [key: string]: boolean }>({
    titleError: false,
    descriptionError: false,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
  ) => {
    setTask((t) => {
      return {
        ...t,
        [e.target.name]: e.target.value,
      };
    });
    setTaskErrors((t) => {
      return {
        ...t,
        [`${e.target.name}Error`]: e.target.value === "",
      };
    });
  };
  const handleOnSubmit = () => {
    const any_error = (obj: { [key: string]: boolean }): boolean => {
      for (const key in obj) {
        if (obj[key]) {
          return true;
        }
      }
      return false;
    };

    if (!any_error(taskErrors)) {
      setLoading(true);
      if (operationType === "create") {
        console.log("entre");
        create(task);
      } else {
        update(task);
      }
    }
  };

  const create = (task: TaskInterface) =>
    taskProvider
      .create(task)
      .then((res: any) => {
        if (res.success) {
          window.location.reload();
        }
        return true;
      })
      .catch(() => setLoading(false));

  const get = (id: string) =>
    taskProvider
      .task(id)
      .then((res: any) => {
        if (res.success) {
          setLoading(false);
          setTask(res.payload);
        }
        return true;
      })
      .catch(() => {
        setLoading(false);
        return false;
      });

  const update = (task: TaskInterface) =>
    taskProvider
      .update(task)
      .then((res: any) => {
        if (res.success) {
          window.location.reload();
        }
        return true;
      })
      .catch(() => setLoading(false));

  useImperativeHandle(ref, () => ({
    async show(operation, _id) {
      let isSuccess = true;
      setOperationType("create");

      if (operation === "update" && !_id)
        return new Error("Field _id is missing for the operation");
      if (operation === "update" && _id) {
        isSuccess = await get(_id);
        if (!isSuccess) return new Error("Could not obtain the data");
        setOperationType("update");
      }
      handleShow();
    },
  }));

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{capitalize(operationType)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <ThreeDots
              visible={true}
              height="50"
              width="60"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <>
            <Form.Group
              className={`position-relative mb-3 ${taskErrors["titleError"] && "mb-5"}`}
              controlId="taskForm.TitleInput"
            >
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name={"title"}
                placeholder="Title task here"
                onChange={handleOnChange}
                value={task.title}
                isInvalid={taskErrors["titleError"]}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                Title should not be empty.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className={`position-relative mb-3 ${taskErrors["descriptionError"] && "mb-5"}`}
              controlId="taskForm.DescriptionInput"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name={"description"}
                rows={3}
                placeholder="Description task here"
                onChange={handleOnChange}
                value={task.description}
                isInvalid={taskErrors["descriptionError"]}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                Description should not be empty.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskForm.FlagInput">
              <Form.Label>Flag</Form.Label>
              <Form.Select
                name="flag"
                onChange={handleOnChange}
                aria-label="Normal"
              >
                <option>Select task flag</option>
                <option
                  value="normal"
                  // @ts-expect-error
                  selected={task.flag === "normal" || task.flag === ""}
                >
                  Normal
                </option>
                <option value="priority" selected={task.flag === "priority"}>
                  Priority
                </option>
                <option value="urgent" selected={task.flag === "urgent"}>
                  Urgent
                </option>
              </Form.Select>
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          onClick={handleOnSubmit}
          variant={operationType === "create" ? "success" : "primary"}
        >
          {capitalize(operationType)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

ModalComponent.displayName = "ModalComponent";

export default ModalComponent;
