"use client";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useGenreStore } from "../utils/useGenreStore";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "25ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));

export default function SearchBar() {
  const setSearchTerm = useGenreStore((state) => state.setSearchTerm);

  const debouncedSearch = useMemo(() => debounce(setSearchTerm, 300), [setSearchTerm]);

  const hintText = "discover...";

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={DOMPurify.sanitize(hintText)}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </Search>
  );
}
