"use client";

import VolunteerTable from "@components/VolunteerTable";
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
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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

  const deleteUsers = async () => {
    try {
      const deletePromises = selected.map((id) => deleteUser(id));
      const responses = await Promise.all(deletePromises);
      const allDeleted = responses.every(
        (response) => response.code === "SUCCESS"
      );

      if (allDeleted) {
        setUsers((prevUsers) =>
          prevUsers
            ? prevUsers.filter((user) => !selected.includes(user.id))
            : []
        );
        setSelected([]);
      } else {
        console.error("Not all deletions succeeded");
      }
      setIsModalOpen(false);
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
              onClick={() => setIsModalOpen(true)}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#101828] opacity-40"></div>
          <div className="bg-white p-6 rounded-2xl shadow-lg z-10 max-w-[512px]">
            <div className="text-[#101828] text-center font-['Kepler_Std'] text-4xl font-semibold">
              Are you sure you want to delete {selected.length}{" "}
              {selected.length === 1 ? "user" : "users"}?
            </div>
            <div className="text-[#667085] text-center text-lg mt-2">
              You will not be able to recover {selected.length === 1 ? "a" : ""}{" "}
              deleted {selected.length === 1 ? "profile" : "profiles"}.
            </div>
            <div className="flex justify-end gap-5 mt-8">
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  border: "1px solid var(--Grey-300, #D0D5DD)",
                  padding: "10px 18px",
                  color: "var(--Teal-800, #145A5A)",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 16,
                }}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  padding: "10px 18px",
                  backgroundColor: "var(--Teal-600, #138D8A)",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 16,
                  "&:hover": { backgroundColor: "var(--Teal-700, #1D7A7A)" },
                }}
                onClick={deleteUsers}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
