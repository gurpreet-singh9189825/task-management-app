import React, { useEffect, useState, FC, useRef } from "react";
import Cards from "../card/Card";
import { db } from "../../auth/firebase";
import Table from "../data-table/Table";
import { collectionGroup, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

type GetData = () => void;

interface DataRow {
  taskName: string;
  assignedBy: string;
  deadline: string;
  assignedTo: string;
  status: string;
  id: string;
  description: string;
  userId: string;
}

interface inputProps {
  openCreateTask: (data: DataRow) => void;
  updateTable: (getData: GetData) => void;
  showTaskOnEdit: (task: boolean) => void;
}

const Dashboard: FC<inputProps> = ({
  showTaskOnEdit,
  openCreateTask,
  updateTable,
}) => {
  const [allTasksData, setAllTasksData] = useState<DataRow[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  const getData = async () => {
    setLoading(true); // Start loading
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "tasks"));

      if (querySnapshot.empty) {
        setAllTasksData([]);
        setTotalTasks(0);
        setPendingTasks(0);
        setCompletedTasks(0);
      } else {
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DataRow[];

        setAllTasksData(tasks);
        setTotalTasks(tasks.length);

        const pending = tasks.filter((task) => task.status === "open");
        setPendingTasks(pending.length);

        const closed = tasks.filter((task) => task.status === "closed");
        setCompletedTasks(closed.length);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getData();
    updateTable(getData);
  }, []);

  const handleEdit = (row: DataRow) => {
    openCreateTask(row);

    showTaskOnEdit(true);
  };

  const handleDelete = async (row: DataRow) => {
    try {
      await deleteDoc(doc(db, "tasks", row.id));
      toast.success("Task Delete Successful", {
        position: "top-right",
      });
      getData();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const columns = [
    {
      name: "Task Name",
      selector: (row: DataRow) => row.taskName,
    },
    {
      name: "Assigned By",
      selector: (row: DataRow) => row.assignedBy,
    },
    {
      name: "Assigned To",
      selector: (row: DataRow) => row.assignedTo,
    },
    {
      name: "Deadline",
      selector: (row: DataRow) => {
        let date = new Date(row.deadline);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        let dateString = `${day}-${month}-${year}`;

        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let timeString = `${hours
          .toString()
          .padStart(2, "0")}:${minutes} ${ampm}`;
        return `${dateString} ${timeString}`;
      },
    },
    {
      name: "Status",
      selector: (row: DataRow) => row.status,
      sortable: true,
    },
    {
      name: "Edit",
      cell: (row: DataRow) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      cell: (row: DataRow) => (
        <div>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="card-container flex justify-around p-16">
        <Cards
          totalTasks={totalTasks}
          closedTasks={completedTasks}
          InProgress={pendingTasks}
        />
      </div>
      <div className="border mt-9 height">
        {loading ? (
          <div className="flex justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <Table columns={columns} data={allTasksData} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
