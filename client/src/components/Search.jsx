import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Search = ({ isNavbar, className }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(searchParams.get("search") || "");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        newParams.set("search", value.trim());
      } else {
        newParams.delete("search");
      }
      navigate(`/posts?${newParams.toString()}`);
    }
  };

  return (
    <div className={`bg-gray-100 p-2 rounded-full flex items-center gap-1 ${isNavbar ? 'w-52' : 'w-full'} ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="min-w-4 flex-shrink-0"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="search a post..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-transparent border-none outline-none w-full text-sm"
      />
    </div>
  )
}

Search.defaultProps = {
  isNavbar: false
}

export default Search
