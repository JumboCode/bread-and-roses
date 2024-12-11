"use client";

import VolunteerTable from "@components/VolunteerTable/VolunteerTable";
import SearchBar from "@components/SearchBar";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@mui/material";
import React from "react";
import { Role, User } from "@prisma/client";
import { deleteUser, getUsersByRole } from "@api/user/route.client";
import Image from "next/image";

export default function VolunteersPage() {
  const [users, setUsers] = React.useState<User[]>();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [searchText, setSearchText] = React.useState("");

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersByRole(Role.VOLUNTEER);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search text
  const filteredUsers = users?.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteUsers = async (selectedIds: string[]) => {
    try {
      const deletePromises = selectedIds.map((id) => deleteUser(id));
      const responses = await Promise.all(deletePromises);
      const allDeleted = responses.every(
        (response) => response.code === "SUCCESS"
      );

      if (allDeleted) {
        setUsers((prevUsers) =>
          prevUsers
            ? prevUsers.filter((user) => !selectedIds.includes(user.id))
            : []
        );
        setSelected([]);
        console.log("All users deleted successfully", responses);
      } else {
        console.error("Not all deletions succeeded");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon="mdi:people" width="44" height="44" />
          <div className="text-4xl font-['Kepler_Std'] font-semibold">
            Volunteer List ({users ? users.length : 0})
          </div>
        </div>
        {selected.length > 0 ? (
          <div className="flex items-center gap-4">
            <div>{selected.length} Selected</div>
            <Button
              sx={{
                display: "flex",
                padding: "10px 18px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "8px",
                backgroundColor: "var(--Rose-600, #E61932)",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "var(--Rose-700, #C11429)",
                },
              }}
              onClick={() => deleteUsers(selected)}
            >
              <DeleteOutlineIcon sx={{ width: 20, color: "whitesmoke" }} />
              <div>Delete</div>
            </Button>
          </div>
        ) : (
          <div className="h-[44.5px]"></div>
        )}
      </div>
      <SearchBar
        onSearchChange={(value) => {
          setSearchText(value);
          setSelected([]);
        }}
      />
      {filteredUsers && filteredUsers.length > 0 ? (
        <VolunteerTable
          showPagination={true}
          fromVolunteerPage
          users={filteredUsers}
          selected={selected}
          setSelected={setSelected}
        />
      ) : (
        <div className="text-center">
          <div className="relative w-full h-[50vh]">
            <Image
              src="/empty_list.png"
              alt="Empty List"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
            No volunteers found!
          </div>
        </div>
      )}
    </div>
  );
}
