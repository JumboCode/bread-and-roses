import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { VolunteerSession } from "@prisma/client";
import React from "react";

interface TimeTableProps {
  volunteerSessions: VolunteerSession[];
}

export default function TimeTable({ volunteerSessions }: TimeTableProps) {
  const [page, setPage] = React.useState(0);

  const sortedSessions = [...volunteerSessions].sort((a, b) => {
    const dateA = new Date(a.dateWorked).getTime();
    const dateB = new Date(b.dateWorked).getTime();

    if (dateA !== dateB) {
      return dateB - dateA; // descending by dateWorked
    }

    const checkInA = new Date(a.checkInTime).getTime();
    const checkInB = new Date(b.checkInTime).getTime();

    return checkInB - checkInA; // ascending by checkInTime if same date
  });

  const paginatedRows = sortedSessions.slice(page * 5, page * 5 + 5);

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
              Date
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
              Total Hours Worked
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
              Time Slot(s)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderColor: "pink" }}>
          {paginatedRows.map((row) => {
            const date = new Date(row.dateWorked).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            });

            const hoursWorked = row.durationHours?.toFixed(1) ?? "N/A";

            const sessionRange =
              row.checkInTime && row.checkOutTime
                ? `${new Date(row.checkInTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })} - ${new Date(row.checkOutTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}`
                : "In Progress";

            return (
              <TableRow
                key={row.id}
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
                  {date}
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
                  {hoursWorked} hours
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
                  {sessionRange}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
          Page {page + 1} of {Math.ceil((volunteerSessions?.length || 0) / 5)}
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
                  Math.ceil((volunteerSessions?.length || 0) / 5) - 1
                )
              )
            }
            disabled={
              page >= Math.ceil((volunteerSessions?.length || 0) / 5) - 1
            }
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              color:
                page >= Math.ceil((volunteerSessions?.length || 0) / 5) - 1
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
    </TableContainer>
  );
}
