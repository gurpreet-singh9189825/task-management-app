import React, { useState, ChangeEvent, useEffect, FC, useRef } from "react";
import "./createTask.css";
import CreateUser from "../create-user/CreateUser";
import { auth } from "../../auth/firebase";
import { User } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "@coreui/coreui/dist/css/coreui.min.css";
import AutoSuggest, {
  SuggestionsFetchRequestedParams,
  SuggestionSelectedEventData,
} from "react-autosuggest";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  limit,
  startAt,
  doc,
  endAt,
  updateDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { db } from "../../auth/firebase";

interface Suggestion {
  id: string;
  name: string;
}
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

interface SuggestionObject {
  suggestion: {
    id: string;
    name: string;
  };
}

interface inputProps {
  data: DataRow | null;
  closeCreateTask: () => void;
  tableUpdate: null | (() => void);
  showOnEdit: boolean;
}
const CreateTask: FC<inputProps> = ({
  data,
  closeCreateTask,
  tableUpdate,
  showOnEdit,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [showTask, setShowTask] = useState<boolean>(false);
  const [form, setForm] = useState({
    taskName: "",
    assignedBy: "",
    assignedTo: "",
    description: "",
    deadline: "",
    userId: "",
    status: "",
  });

  const taskEl = useRef<HTMLDivElement>(null);
  function handleButtonClick() {
    setShowTask(true);
  }
  const initialValues = {
    taskName: "",
    assignedBy: "",
    assignedTo: "",
    description: "",
    deadline: "",
    userId: "",
    status: "",
  };

  useEffect(() => {
    if (taskEl.current) {
      taskEl.current.scrollIntoView({ behavior: "smooth" });
    }
    const currentUser = auth.currentUser;
    setUser(currentUser);
    if (showOnEdit) {
      setShowTask(true);
    }
  });
  useEffect(() => {
    if (data) {
      setForm(data);
      setValue(data.assignedTo);
    }
  }, [data]);

  useEffect(() => {
    getSuggestions(value);
  }, [value]);
  //db query
  const getSuggestions = async (value: string): Promise<Suggestion[]> => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("username", ">=", value.toLowerCase()),
        where("username", "<=", value.toLowerCase() + "\uf8ff"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return [];
      } else {
        const fetchedSuggestions: Suggestion[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.username) {
            fetchedSuggestions.push({ id: data.id, name: data.username });
          }
        });
        return fetchedSuggestions;
      }
    } catch (error) {
      console.error("Error fetching suggestions: ", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAutoSuggestOnChange = (
    _: React.ChangeEvent<any>,
    { newValue }: { newValue: string }
  ) => {
    setValue(newValue);
  };

  const inputProps = {
    placeholder: "Type a username",
    value: value,
    onChange: handleAutoSuggestOnChange,
  };

  const handleFetchRequest = async (options: {
    value: string;
    reason: string;
  }) => {
    const fetchedResults = await getSuggestions(value);

    setSuggestions(fetchedResults);
  };

  const onSuggestionSelected = (_: any, suggestion: SuggestionObject) => {
    const { id, name } = suggestion.suggestion;

    setForm((prevForm) => ({
      ...prevForm,
      assignedTo: name,
      userId: id,
      status: "open",
    }));
    setValue(name);
    setSuggestions([]);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const user = auth.currentUser;
    setSpinner(true);
    event.preventDefault();
    if (data && user) {
      const taskRef = firestoreDoc(db, "tasks", data.id);
      await updateDoc(taskRef, form);
      setSpinner(false);
      toast.success("Task updated successfully!");

      if (tableUpdate) {
        tableUpdate();
      }

      closeCreateTask();
    } else {
      if (user) {
        const taskRef = doc(collection(db, "tasks"));
        await setDoc(taskRef, form);
        setForm(initialValues);
        setValue("");
        setSpinner(false);
        toast.success("Task created successfully!");
      } else {
        toast.info("Login to create or update task");
        setSpinner(false);
      }
    }
  };

  return (
    <div>
      {showTask ? (
        <div ref={taskEl}>
          <div className="form-container flex justify-center mt-2 h-screen items-center">
            <CreateUser />
            <form
              onSubmit={handleFormSubmit}
              id="form"
              className="flex-child grow-0 shrink basis-2/4 border form-height flex flex-col gap-y-3 p-3"
            >
              <div>
                <label>Task Name</label>
                <input
                  type="text"
                  placeholder="Task Name"
                  name="taskName"
                  id="task"
                  className="p-2 input-style"
                  onChange={handleInputChange}
                  value={form.taskName}
                />
              </div>
              <div>
                <label>Assigned By</label>
                <input
                  type="text"
                  placeholder="Assigned By"
                  name="assignedBy"
                  id="assignedBy"
                  className="p-2 input-style text-green-500"
                  onChange={handleInputChange}
                  value={(form.assignedBy = user?.email ?? "")}
                  readOnly
                />
              </div>
              <div className="auto-suggest-cont flex ">
                <div className="basis-1/5">
                  <label className="full-width mt-2">Assigned To</label>
                </div>
                <div className="basis-3/5">
                  <AutoSuggest
                    suggestions={suggestions}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    onSuggestionsFetchRequested={handleFetchRequest}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={(suggestion: Suggestion) =>
                      suggestion.name
                    }
                    renderSuggestion={(suggestion: Suggestion) => (
                      <div className=" auto-suggestion">{suggestion.name}</div>
                    )}
                    inputProps={inputProps}
                    highlightFirstSuggestion={true}
                  />
                  {loading && <div>Loading...</div>}
                </div>
              </div>
              <div>
                <label>Deadline</label>
                <input
                  type="datetime-local"
                  placeholder="deadline"
                  name="deadline"
                  id="deadline"
                  className="p-2 input-style"
                  onChange={handleInputChange}
                  value={form.deadline}
                />
              </div>

              <div className="flex items-center">
                <label>Task Description</label>
                <textarea
                  rows={4}
                  cols={50}
                  name="description"
                  className="txt-area input-style"
                  onChange={handleInputChange}
                  value={form.description}
                ></textarea>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setLoading(loading)}
                  className="px-8 py-2 bg-green-500 rounded text-white"
                >
                  Done
                  <ClipLoader
                    color={"white"}
                    loading={spinner}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="create-user h-screen flex justify-center gap-y-2 border flex-col items-center">
          <button
            onClick={handleButtonClick}
            className="px-10 py-3 bg-green-500 rounded btn-color"
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateTask;

//     <div>
//       <div className="form-container flex justify-center mt-2 h-screen items-center">
//         <CreateUser />
//         <form
//           onSubmit={handleFormSubmit}
//           id="form"
//           className="flex-child grow-0 shrink basis-2/4 border form-height flex flex-col gap-y-3 p-3"
//         >
//           <div>
//             <label>Task Name</label>
//             <input
//               type="text"
//               placeholder="Task Name"
//               name="taskName"
//               id="task"
//               className="p-2"
//               onChange={handleInputChange}
//               value={form.taskName}
//             />
//           </div>
//           <div>
//             <label>Assigned By</label>
//             <input
//               type="text"
//               placeholder="Assigned By"
//               name="assignedBy"
//               id="assignedBy"
//               className="p-2"
//               onChange={handleInputChange}
//               value={(form.assignedBy = user?.email ?? "")}
//               readOnly
//             />
//           </div>
//           <div className="auto-suggest-cont">
//             <label>Assigned To</label>
//             <AutoSuggest
//               suggestions={suggestions}
//               onSuggestionsClearRequested={() => setSuggestions([])}
//               onSuggestionsFetchRequested={handleFetchRequest}
//               onSuggestionSelected={onSuggestionSelected}
//               getSuggestionValue={(suggestion: Suggestion) => suggestion.name}
//               renderSuggestion={(suggestion: Suggestion) => (
//                 <div className="border auto-suggestion">
//                   <span>{suggestion.name}</span>
//                 </div>
//               )}
//               inputProps={inputProps}
//               highlightFirstSuggestion={true}
//             />
//             {loading && <div>Loading...</div>}
//           </div>
//           <div>
//             <label>Deadline</label>
//             <input
//               type="datetime-local"
//               placeholder="deadline"
//               name="deadline"
//               id="deadline"
//               className="p-2"
//               onChange={handleInputChange}
//               value={form.deadline}
//             />
//           </div>

//           <div className="flex items-center">
//             <label>Task Description</label>
//             <textarea
//               rows={4}
//               cols={50}
//               name="description"
//               className="txt-area"
//               onChange={handleInputChange}
//               value={form.description}
//             ></textarea>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <button className="px-8 py-2 bg-sky-500 rounded">Done</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
