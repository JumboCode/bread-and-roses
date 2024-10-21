import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import IconButton from "@mui/material/IconButton";

import profilePic from "../../../public/profile.png";

function createData(
  name: string,
  type: number,
  email: string,
  location: string
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
            <TableCell sx={{ color: "#667085", fontWeight: "bold" }}>
              Name
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "#667085", fontWeight: "bold" }}
            >
              Type
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "#667085", fontWeight: "bold" }}
            >
              Email address
            </TableCell>
            <TableCell
              align="left"
              sx={{ color: "#667085", fontWeight: "bold" }}
            >
              Location
            </TableCell>
            <TableCell align="center"></TableCell>
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
                sx={{
                  borderColor: "#E4E7EC",
                  color: "#344054",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                }}
                component="th"
                scope="row"
              >
                <Avatar alt={row.name} src={profilePic.src} />
                {row.name}
              </TableCell>
              <TableCell
                sx={{ borderColor: "#E4E7EC", color: "#344054" }}
                align="left"
              >
                {row.type}
              </TableCell>
              <TableCell
                sx={{ borderColor: "#E4E7EC", color: "#344054" }}
                align="left"
              >
                {row.email}
              </TableCell>
              <TableCell
                sx={{ borderColor: "#E4E7EC", color: "#344054" }}
                align="left"
              >
                {row.location}
              </TableCell>
              <TableCell
                sx={{ borderColor: "#E4E7EC", padding: "0 15px 0 0" }}
                align="right"
              >
                <IconButton aria-label="delete volunteer">
                  <DeleteOutlineIcon sx={{ color: "#344054" }} />
                </IconButton>
                <IconButton aria-label="more information on volunteer">
                  <ArrowRightAltIcon sx={{ color: "#344054" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}