import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import CreateUser from "./components/create-user/CreateUser";
import CreateTask from "./components/create-task/CreateTask";
import Root from "./pages/Root";
import Dashboard from "./components/dashboard/Dashboard";
import HomeParent from "./components/HomeParent";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/dashboard", element: <HomeParent /> },
      {
        path: "/task",
        element: (
          <CreateTask
            data={null}
            closeCreateTask={function (): void {
              throw new Error("Function not implemented.");
            }}
            tableUpdate={null}
            showOnEdit={false}
          />
        ),
      },
    ],
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
