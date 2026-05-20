"use client";

import Image from "next/image";
import React from "react";
import { authClient } from "../lib/auth-client";

const Alllistindrooms = ({ da, token }) => {
  const {
    _id,
    roomName,
    description,
    image,
    floor,
    capacity,
    rate,
    amenities = [],
  } = da || {};

  // Delete Room
  const onDelete = async () => {
    try {
      let activeToken = token;
      if (!activeToken) {
        const tokenRes = await authClient.token();
        activeToken = tokenRes?.data?.token;
      }
       
      const res = await fetch(`http://localhost:5000/listed/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const result = await res.json();

      console.log("DELETE RESULT:", result);

      if (res.ok) {
        alert("Room deleted successfully");
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="max-w-sm bg-[#111827] rounded-2xl shadow-lg overflow-hidden border border-gray-800">
      
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={
            image ||
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          }
          alt={roomName || "room"}
          fill
          className="object-cover"
        />

        <span className="absolute top-3 right-3 bg-white text-black text-xs px-2 py-1 rounded-md font-semibold">
          ${rate || 0}/hr
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        
        {/* Title */}
        <h2 className="text-lg font-semibold text-white">
          {roomName}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-300 flex-wrap">
          <span>📍 Floor {floor}</span>
          <span>👥 Up to {capacity} people</span>
          <span>💲 ${rate}/hr</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {amenities.length > 0 ? (
            amenities.map((text, i) => (
              <span
                key={i}
                className="bg-gray-800 px-2 py-1 rounded-full text-xs text-white"
              >
                {text}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">
              No amenities
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm text-white transition">
            View
          </button>

          <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm text-white transition">
            Edit
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 px-4 rounded-lg text-white transition"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alllistindrooms;