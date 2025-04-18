"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "@components/UserAvatar";
import { UserWithVolunteerDetail } from "../app/types";

interface VolunteerTableProps {
  showPagination: boolean;
  fromVolunteerPage: boolean;
  fromAttendeePage: boolean;
  users: UserWithVolunteerDetail[] | undefined;
  selected?: string[];
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function VolunteerTable({
  showPagination,
  fromVolunteerPage,
  fromAttendeePage,
  users,
  selected,
  setSelected,
}: VolunteerTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCheckboxChange = (name: string) => {
    if (setSelected) {
      setSelected((prevSelected) =>
        prevSelected.includes(name)
          ? prevSelected.filter((item) => item !== name)
          : [...prevSelected, name]
      );
    }
  };

  const isRowSelected = (name: string) => selected?.includes(name);

  const paginatedRows =
    users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  useEffect(() => {
    setPage(0);
  }, [users?.length]);

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableContainerRef.current && fromVolunteerPage) {
        const containerHeight = tableContainerRef.current.clientHeight;
        const rowHeight = 74.5;
        const calculatedRows = Math.floor(containerHeight / rowHeight);
        setRowsPerPage(calculatedRows > 0 ? calculatedRows : 1);
      } else {
        setRowsPerPage(3);
      }
    };

    updateRowsPerPage();
  }, [fromVolunteerPage]);

  return (
    <TableContainer
      ref={tableContainerRef}
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
            {fromVolunteerPage ? (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={paginatedRows.every((row) =>
                    selected?.includes(row.id)
                  )}
                  onChange={() => {
                    const currentPageIds = paginatedRows.map((row) => row.id);
                    if (
                      paginatedRows.every((row) =>
                        selected?.includes(row.id)
                      ) &&
                      setSelected
                    ) {
                      setSelected((prevSelected) =>
                        prevSelected.filter(
                          (id) => !currentPageIds.includes(id)
                        )
                      );
                    } else if (setSelected) {
                      setSelected((prevSelected) => [
                        ...prevSelected,
                        ...currentPageIds.filter(
                          (id) => !prevSelected.includes(id)
                        ),
                      ]);
                    }
                  }}
                  sx={{
                    "& .MuiTouchRipple-root": {
                      color: "var(--Rose-50, #FFF0F1)",
                    },
                  }}
                  icon={
                    <span
                      style={{
                        display: "inline-block",
                        width: "18px",
                        height: "18px",
                        borderRadius: "6px",
                        border: "1px solid var(--Grey-300, #D0D5DD)",
                        backgroundColor: "var(--White, #FFF)",
                      }}
                    />
                  }
                  checkedIcon={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "18px",
                        height: "18px",
                        borderRadius: "6px",
                        backgroundColor: "var(--Rose-50, #FFF0F1)",
                        border: "1px solid var(--Rose-600, #E61932)",
                      }}
                    >
                      <Icon
                        icon="ic:round-check"
                        height="14"
                        width="14"
                        style={{ color: "var(--Rose-600, #E61932)" }}
                      />
                    </span>
                  }
                />
              </TableCell>
            ) : null}
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
              {fromAttendeePage ? "Time(s)" : "Location"}
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
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                borderColor: "pink",
              }}
            >
              {fromVolunteerPage ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isRowSelected(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                    sx={{
                      "& .MuiTouchRipple-root": {
                        color: "var(--Rose-50, #FFF0F1)",
                      },
                    }}
                    icon={
                      <span
                        style={{
                          display: "inline-block",
                          width: "18px",
                          height: "18px",
                          borderRadius: "6px",
                          border: "1px solid var(--Grey-300, #D0D5DD)",
                          backgroundColor: "var(--White, #FFF)",
                        }}
                      />
                    }
                    checkedIcon={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "18px",
                          height: "18px",
                          borderRadius: "6px",
                          backgroundColor: "var(--Rose-50, #FFF0F1)",
                          border: "1px solid var(--Rose-600, #E61932)",
                        }}
                      >
                        <Icon
                          icon="ic:round-check"
                          height="14"
                          width="14"
                          style={{ color: "var(--Rose-600, #E61932)" }}
                        />
                      </span>
                    }
                  />
                </TableCell>
              ) : null}
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  fontWeight: "bold",
                  color: "#101828",
                  verticalAlign: fromAttendeePage ? "top" : "baseline",
                }}
                component="th"
                scope="row"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar
                    firstName={row.firstName}
                    lastName={row.lastName}
                  />
                  {row.firstName + " " + row.lastName}
                </div>
              </TableCell>

              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  color: "#344054",
                  height: "72px",
                  width: "255px",
                  verticalAlign: fromAttendeePage ? "top" : "baseline",
                  paddingTop: fromAttendeePage ? "25px" : "16px",
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
                  verticalAlign: fromAttendeePage ? "top" : "baseline",
                  paddingTop: fromAttendeePage ? "25px" : "16px",
                }}
                align="left"
              >
                {fromAttendeePage
                  ? row.timeSlots && row.timeSlots.length > 0
                    ? [...row.timeSlots]
                        .sort(
                          (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                        )
                        .map((slot, idx) => {
                          const start = new Date(slot.startTime);
                          const end = new Date(slot.endTime);

                          const format = (date: Date) =>
                            date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });

                          return (
                            <div key={idx}>
                              {format(start)} - {format(end)}
                            </div>
                          );
                        })
                    : "No Time Slots"
                  : row?.volunteerDetails?.address
                  ? `${row.volunteerDetails.address}, ${row.volunteerDetails.city}, ${row.volunteerDetails.state} ${row.volunteerDetails.zipCode}`
                  : "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  borderColor: "#E4E7EC",
                  padding: "0 15px 0 0",
                  height: "44px",
                  width: "255px",
                  verticalAlign: fromAttendeePage ? "top" : "baseline",
                  paddingTop: "16px",
                }}
                align="right"
              >
                {fromVolunteerPage || fromAttendeePage ? (
                  "View"
                ) : (
                  <IconButton aria-label="delete volunteer">
                    <DeleteOutlineIcon sx={{ color: "#344054" }} />
                  </IconButton>
                )}
                <IconButton aria-label="more information on volunteer">
                  <ArrowRightAltIcon sx={{ color: "#344054" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid #E4E7EC",
          }}
        >
          <Typography
            sx={{ fontSize: "14px", color: "#344054", fontWeight: 500 }}
          >
            Page {page + 1} of {Math.ceil((users?.length || 0) / rowsPerPage)}
          </Typography>

          <Box>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              sx={{
                marginRight: "8px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                color: page === 0 ? "#D0D5DD" : "#145A5A",
                borderRadius: 2,
                border: "1px solid var(--Grey-300, #D0D5DD)",
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil((users?.length || 0) / rowsPerPage) - 1
                  )
                )
              }
              disabled={
                page >= Math.ceil((users?.length || 0) / rowsPerPage) - 1
              }
              sx={{
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                color:
                  page >= Math.ceil((users?.length || 0) / rowsPerPage) - 1
                    ? "#D0D5DD"
                    : "#145A5A",
                borderRadius: 2,
                border: "1px solid var(--Grey-300, #D0D5DD)",
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </TableContainer>
  );
}
