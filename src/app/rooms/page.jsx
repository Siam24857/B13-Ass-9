"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Allrooms from "./Allrooms";

export default function StudyRoomSearch() {
  const [data, setData] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Rooms
  useEffect(() => {
    const url = selectedAmenity 
      ? `http://localhost:5000/rooms/${selectedAmenity}` 
      : "http://localhost:5000/rooms";
    
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedAmenity]);

  // Filter Handle
  const handleFilter = (e) => {
    if (e.target.checked) {
      setSelectedAmenity(e.target.value);
    } else {
      setSelectedAmenity("");
    }
  };

  // Search Bar Handle
  const SearchBarHandle = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear All Filters
  const clearFilters = () => {
    setSelectedAmenity("");
    setSearchTerm("");
  };

  
  
  // Filter data by search term
  const filteredData = data.filter((room) => {
  return room.roomName
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());
});
 



  const amenities = [
    { label: "Whiteboard" },
    { label: "Projector" },
    { label: "Wi-Fi" },
    { label: "Power Outlets" },
    { label: "Quiet Zone" },
    { label: "Air Conditioning" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f1c2e] border border-gray-800 px-10 py-12">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white">
          Available Study Rooms
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Find and book the perfect space for focused studying
        </p>
      </div>

      {/* Search Bar */}
      <div className=" relative max-w-3xl mb-10">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          size={22}
        />
        <input
          type="text"
          placeholder="Search by room name..."
          value={searchTerm}
          onChange={SearchBarHandle}
          className="
            w-full
            bg-[#111f33]
            border
            border-gray-700
            rounded-xl
            py-4
            pl-14
            pr-4
            text-white
            placeholder:text-gray-500
            outline-none
            focus:border-blue-500
            transition-all
          "
        />
      </div>

      <div className="flex gap-9">

<div className="w-[260px] shrink-0">
  <div className="sticky top-6 rounded-2xl bg-[#0f1724] p-6 text-white shadow-xl border border-white/10 w-[260px]">

    {/* Filter Header */}
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Filters</h2>

      <button
        onClick={clearFilters}
        className="text-sm font-medium text-orange-400 hover:text-orange-300"
      >
        Clear all
      </button>
    </div>

    {/* Amenities */}
    <div className="mb-7">
      <h3 className="mb-4 text-lg font-semibold">Amenities</h3>

      <div className="space-y-4">
        {amenities.map((item) => (
          <label
            key={item.label}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              value={item.label}
              checked={selectedAmenity === item.label}
              onChange={handleFilter}
              className="h-5 w-5 rounded border border-gray-400 bg-transparent accent-orange-400"
            />

            <span className="text-[17px] text-gray-100">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>

  </div>
</div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {filteredData.map((da) => (
            <Allrooms key={da._id}  da={da} />
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">
              No rooms found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}