import react, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../auth/firebase";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isUser, setIsUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(user);
      }
    });
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        setIsUser(null);
        toast.success("Sign out successful!", {
          position: "top-right",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.success("Error signing out! Try Again!", {
          position: "top-right",
        });
      });
  };

  const handleDashBoardClick = () => {
    navigate("/dashboard");
  };
  const handleCreateTaskClick = () => {
    navigate("/task");
  };

  return (
    <nav className="flex justify-end p-3 border bg-black text-white">
      <Link to="/task" className="mr-auto">
        Project ManageMent
      </Link>
      {isUser ? (
        <>
          <div
            style={{ cursor: "pointer" }}
            className="mx-3 hover:text-red-500"
            onClick={handleCreateTaskClick}
          >
            CreateTask
          </div>
          <div
            style={{ cursor: "pointer" }}
            className="mx-3 hover:text-red-500"
            onClick={handleDashBoardClick}
          >
            DashBoard
          </div>
          <div className="mx-3">Welcome: {isUser?.email}</div>
          <div
            style={{ cursor: "pointer" }}
            onClick={handleSignOut}
            className="mx-3 hover:text-red-500"
          >
            Signout
          </div>
        </>
      ) : (
        <>
          <div className="mx-3">
            <Link to="/"> login</Link>
          </div>
          <div className="mx-3">
            <Link to="register">Register</Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
