import { useState } from "react";
import { searchUsers } from "../services/UserService.js";
import DropDown from "../containers/DropDown.jsx";

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchHandler = async () => {
    try {
      // API returns { success: bool, data: [{ user_id, username, email }] }
      const response = await searchUsers(searchQuery);
      setSearchResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col relative ">
      <div className="flex gap-1 items-center border-2 border-zinc-900  bg-slate-100">
        <input
          value={searchQuery}
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="flex-1 pl-4 w-45 p-2 outline-none"
        />
        <button
          onClick={searchHandler}
          className="p-2 bg-zinc-900 text-slate-100 border-l-2 border-zinc-900"
        >
          Search
        </button>
      </div>
      {showDropdown && (
        <div className="absolute top-full left-0 w-full z-50">
          <DropDown searchResults={searchResults} />
        </div>
      )}
    </div>
  );
}
