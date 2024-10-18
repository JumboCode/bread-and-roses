import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  name: string,
  type: number,
  email: string,
  location: string,
) {
  return { name, type, email, location };
}

const rows = [
  createData("Name1", 0, "email1", "location1"),
  createData("Name2", 1, "email2", "location2"),
  createData("Name3", 2, "email3", "location2"),
  createData("Name4", 3, "email4", "location3"),
];

export default function VolunteerTable() {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650, borderColor: "#E4E7EC" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
            <TableCell>Name</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Email address</TableCell>
            <TableCell align="left">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderColor: "pink" }}>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                borderColor: "pink",
              }}
            >
              <TableCell
                sx={{ borderColor: "#E4E7EC" }}
                component="th"
                scope="row"
              >
                {row.name}
              </TableCell>
              <TableCell sx={{ borderColor: "#E4E7EC" }} align="left">
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                {row.type}
              </TableCell>
              <TableCell sx={{ borderColor: "#E4E7EC" }} align="left">
                {row.email}
              </TableCell>
              <TableCell sx={{ borderColor: "#E4E7EC" }} align="left">
                {row.location}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// box-shadow: 0px 2px 4px -2px #1018280F;

// box-shadow: 0px 4px 8px -2px #1018281A;


