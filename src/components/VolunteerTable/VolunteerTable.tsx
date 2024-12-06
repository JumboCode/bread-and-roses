'use client';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Avatar from "@mui/material/Avatar";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import React, { useState } from "react";

import profilePic from "../../../public/profile.png";

interface VolunteerTableProps {
    showPagination: boolean;
}

function createData(
  name: string,
  type: number,
  email: string,
  location: string
) {
  return { name, type, email, location };
}

function getUserRole(userType: number): string {
  switch (userType) {
    case 0:
      return "Corporate Team";
    case 1:
      return "Community Group";
    case 2:
      return "Individual Volunteer";
    default:
      return "undefined user role";
  }
}

const rows = [
  createData("Name1", 0, "email1", "location1"),
  createData("Name2", 1, "email2", "location2"),
  createData("Name3", 2, "email3", "location2"),
  createData("Name4", 0, "email1", "location1"),
  createData("Name5", 1, "email2", "location2"),
  createData("Name6", 2, "email3", "location2"),
  createData("Name7", 0, "email1", "location1"),
  createData("Name8", 1, "email2", "location2"),
  createData("Name9", 2, "email3", "location2"),
  createData("Name10", 0, "email1", "location1"),
  createData("Name11", 1, "email2", "location2"),
  createData("Name12", 2, "email3", "location2"),
  createData("Name13", 0, "email1", "location1"),
  createData("Name14", 1, "email2", "location2"),
  createData("Name15", 2, "email3", "location2"),
];

export default function VolunteerTable({ showPagination }: VolunteerTableProps) {
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage] = useState(8); // Set rows per page to 8

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

  // Pagination Logic
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer
      sx={{
        border: "solid 1px #E4E7EC",
        borderRadius: "12px",
        boxShadow: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          borderColor: "#E4E7EC",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
            <TableCell
              sx={{
                color: "#667085",
                fontWeight: "bold",
                height: "44px",
                width: "255px",
              }}
            >
              Name
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: "#667085",
                fontWeight: "bold",
                height: "44px",
                width: "255px",
              }}
            >
              Type
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: "#667085",
                fontWeight: "bold",
                height: "44px",
                width: "255px",
              }}
            >
              Email address
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color: "#667085",
                fontWeight: "bold",
                height: "44px",
                width: "255px",
              }}
            >
              Location
            </TableCell>
            <TableCell
              sx={{ width: "116px", height: "44px  " }}
              align="center"
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderColor: "pink" }}>
          {paginatedRows.map((row) => (
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
                  fontWeight: "bold",
                  color: "#101828",
                }}
                component="th"
                scope="row"
              >
                <div className="flex items-center gap-4">
                  <Avatar alt={row.name} src={profilePic.src} />
                  {row.name}
                </div>
              </TableCell>
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  color: "#344054",
                  height: "72px",
                  width: "255px",
                }}
                align="left"
              >
                {getUserRole(row.type)}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  color: "#344054",
                  height: "72px",
                  width: "255px",
                }}
                align="left"
              >
                {row.email}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  color: "#344054",
                  height: "72px",
                  width: "255px",
                }}
                align="left"
              >
                {row.location}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  padding: "0 15px 0 0",
                  height: "44px",
                  width: "255px",
                }}
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
      {showPagination && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[8]}
        />
      )}
    </TableContainer>
  );
}
