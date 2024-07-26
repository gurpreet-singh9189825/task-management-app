import DataTable, { TableColumn } from "react-data-table-component";

import react, { FC } from "react";

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
  data: DataRow[];
  columns: TableColumn<DataRow>[];
}

const Table: FC<inputProps> = ({ columns, data }) => {
  return <DataTable columns={columns} data={data} pagination />;
};

export default Table;
