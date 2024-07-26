import react, { useState, useEffect, FC } from "react";
import Dashboard from "./dashboard/Dashboard";
import CreateTask from "./create-task/CreateTask";

interface DataRow {
  taskName: string;
  assignedBy: string;
  deadline: string;
  assignedTo: string;
  status: string;
  id: string;
  userId: string;
  description: string;
}

type UpdateTableFunction = () => void;

const HomeParent: FC = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskData, setTaskData] = useState<null | DataRow>(null);
  const [tableUpdate, setTableUpdate] = useState<UpdateTableFunction | null>(
    null
  );
  const [showOnEdit, setShowOnEdit] = useState<boolean>(false);

  const handleOpenCreateTask = (data: DataRow) => {
    setTaskData(data);
    setShowCreateTask(true);
  };

  const handleCloseCreateTask = () => {
    setShowCreateTask(false);
    setTaskData(null);
  };

  const updateTable = (getData: UpdateTableFunction) => {
    setTableUpdate(() => getData);
  };

  const showCreateTaskOnEdit = (task: boolean) => {
    setShowOnEdit(task);
  };

  return (
    <div className="home-container">
      <div className="dashboard">
        <Dashboard
          openCreateTask={handleOpenCreateTask}
          updateTable={updateTable}
          showTaskOnEdit={showCreateTaskOnEdit}
        />
      </div>
      {showCreateTask && (
        <div className="create-task">
          <CreateTask
            showOnEdit={showOnEdit}
            closeCreateTask={handleCloseCreateTask}
            data={taskData}
            tableUpdate={tableUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default HomeParent;
