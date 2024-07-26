import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Input from "../input/Input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../auth/firebase.js";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredentials.user;
      if (user) {
        toast.success("Registration Successful", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  return (
    <div className="flex justify-center items-center  h-screen">
      <div className="form min-h-96 grow-0 shrink basis-1/4 border p-2 shadow-cyan-500/50 ">
        <h1 className="text-3xl p-3 mt-2 font-black">Register here</h1>
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

              <button className="bg-sky-500 mt-6 p-1" type="submit">
                Register
              </button>
              <h1 className="mt-3">
                Already Registered
                <Link to="/" className="ml-3 text-red-500">
                  Login
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
