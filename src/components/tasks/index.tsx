"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TaskProvider from "../http/tasks";
import TaskItem from "./TaskItem";
import { ThreeDots } from "react-loader-spinner";
import { Container, Row } from "react-bootstrap";
import { TaskInterface } from "../interface/task.interface";

const order = ["urgent", "priority", "normal"];
const TaskComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const taskProvider = new TaskProvider(
      session?.user?.account?.access_token ?? "",
    );

    setLoading(true);
    taskProvider
      .tasks()
      .then((res: any) => {
        setLoading(false);
        setTasks(
          res.payload.sort((a: TaskInterface, b: TaskInterface) => {
            return order.indexOf(a.flag) - order.indexOf(b.flag);
          }),
        );
      })
      .catch((e: any) => {
        setLoading(false);
        console.log(e);
      });
  }, [session?.user?.account?.access_token]);

  return (
    <Container className="mt-3">
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
        <Row>
          {tasks.map((t: any) => (
            <TaskItem key={t._id} {...t} />
          ))}
        </Row>
      )}
    </Container>
  );
};

export default TaskComponent;
