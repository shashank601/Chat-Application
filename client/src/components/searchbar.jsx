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
    <div>
      <input
        value={searchQuery}
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className=""
      />
      <button onClick={searchHandler} className="">
        Search
      </button>
      {showDropdown && <DropDown searchResults={searchResults} />}
    </div>
  );
}
