import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Input from "../input/Input";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [spinner, setSpinner] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const auth = getAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setSpinner(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          setSpinner(false);
          toast.success("Login Successful", {
            position: "top-right",
          });
          navigate("/task");
        }
        // ...
      })
      .catch((error) => {
        setSpinner(false);
        toast.info("Credentials dont match", {
          position: "top-right",
        });
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleForgotPassword = () => {
    const formValues = getValues();
    sendPasswordResetEmail(auth, formValues.email)
      .then(() => {
        toast.info(`password reset email sent to ${formValues.email}`);
      })
      .catch((error) => {
        toast.info("something bad happen, try again");
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className="flex justify-center items-center  h-screen ">
      <div className="form min-h-96 grow-0 shrink basis-1/4 border p-2 shadow-cyan-500/50 bg-white rounded  ">
        <h1 className="text-3xl p-3 mt-2 font-black">Welcome! Login</h1>
        <div className="form  min-h-80 flex flex-col justify-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-container flex flex-col justify-center gap-y-1">
              <div>
                <label className="block " htmlFor="email">
                  Email:{" "}
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email must be a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      className="outline mt-2 min-w-full"
                    />
                  )}
                />
                {errors.email && (
                  <span style={{ color: "red" }}>{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block mt-2" htmlFor="password">
                  Password:{" "}
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="password"
                      className="outline  min-w-full"
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <span style={{ color: "red" }}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSpinner(spinner)}
                className="bg-sky-500 mt-6 p-1"
                type="submit"
              >
                Login
                <ClipLoader
                  color={"white"}
                  loading={spinner}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </button>
              <h1 className="mt-3">
                Don't have account
                <Link to="/register" className=" ml-3 text-red-500">
                  Register
                </Link>
              </h1>
              <div onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
                <h3 className=" mt-3 text-red-500">Forgot Password</h3>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
