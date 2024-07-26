import react, { useState, ChangeEvent, CSSProperties } from "react";
import Input from ".././input/Input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { db } from "../../auth/firebase";
import "./createUser.css";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

interface CreateUser {
  user: string;
}

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUser>({
    defaultValues: {
      user: "",
    },
  });

  const uniqueId = nanoid();

  const onSubmit: SubmitHandler<CreateUser> = async (data) => {
    setLoading(true);

    const dbData = {
      username: data.user,
      id: uniqueId,
    };

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", data.user)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newCityRef = doc(collection(db, "users"));
        await setDoc(newCityRef, dbData);
        setLoading(false);
        toast.success("User created successfully!");
        reset();
      } else {
        setLoading(false);
        toast.error("Duplicate name found. Data not saved.");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("login to add user: " + error.message);
    }
  };

  return (
    <div className="basis-2/4 flex justify-center">
      <div className="input ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="user"
            control={control}
            rules={{
              required: "user is required",
            }}
            render={({ field }) => (
              <Input
                type="text"
                className="outline-none p-1 create-user"
                {...field}
              />
            )}
          />
          {errors.user && (
            <span style={{ color: "red" }}>{errors.user.message}</span>
          )}

          <button
            type="submit"
            onClick={() => setLoading(loading)}
            className="ml-2 p-2 text-white b bg-green-500 rounded"
          >
            Create User
            <div style={{ display: "inline", marginLeft: "3px" }}>
              <ClipLoader
                color={"white"}
                loading={loading}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
