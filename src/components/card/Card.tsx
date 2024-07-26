import react, { FC } from "react";

interface inputProps {
  totalTasks: number;
  closedTasks: number;
  InProgress: number;
}

const Cards: FC<inputProps> = ({ totalTasks, closedTasks, InProgress }) => {
  return (
    <>
      <div className="card-container min-w-40 border  gap-xy-4 min-h-40 bg-green-500 flex justify-center rounded-full items-center">
        <div className=" font-semibold text-xl ">Total Tasks:{totalTasks}</div>
      </div>
      <div className="card-container min-w-40 border min-h-40  bg-sky-500 flex justify-center items-center rounded-full">
        <div className=" font-semibold text-xl">Closed Tasks:{closedTasks}</div>
      </div>
      <div className="card-container border min-h-40 min-w-40  bg-purple-500 flex justify-center rounded-full items-center">
        <div className="font-semibold text-xl">In Progress:{InProgress}</div>
      </div>
    </>
  );
};

export default Cards;
