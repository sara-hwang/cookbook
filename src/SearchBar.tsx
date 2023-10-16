import { useEffect, useState } from "react";
import "./Search.css";
import logo from "./icon.png";

interface IProps {
  isActive: boolean;
  onExpand: () => void;
}

function SearchBar({ isActive, onExpand }: IProps) {
  return (
    <div className={`search ${isActive ? "active" : ""}`} id="search-bar">
      <button
        className="search-button"
        onClick={() => {
          onExpand();
        }}
      >
        <img src={logo} className="logo" />
      </button>
      <input
        className="search-txt"
        type="text"
        placeholder="Enter tags seperated by space..."
      />
    </div>
  );
}

export default SearchBar;
