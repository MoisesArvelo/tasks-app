import TaskComponent from "@/components/tasks";
import NavComponent from "@/components/nav";

const Dashboard = async () => {
  return (
    <div>
      <NavComponent />
      <TaskComponent />
    </div>
  );
};

export default Dashboard;
