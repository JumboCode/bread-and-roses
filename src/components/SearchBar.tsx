import React from "react";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearchChange: (searchText: string) => void;
}

const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "5px 7px",
        alignItems: "center",
        gap: "8px",
        borderRadius: "8px",
        border: "1px solid var(--Grey-300, #D0D5DD)",
        background: "var(--White, #FFF)",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <SearchIcon sx={{ color: "var(--Grey-500, #667085)" }} />
      <InputBase
        placeholder="Search"
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: "100%",
          fontSize: "14px",
          color: "var(--Grey-700, #344054)",
          "& input::placeholder": {
            color: "var(--Grey-500, #667085)",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
