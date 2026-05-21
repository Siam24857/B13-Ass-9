"use client";
import React, { useState } from "react";
import { Button, Input, Label, TextArea } from "@heroui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthHeaders } from "../lib/auth-client";
import { API_URL } from "../lib/config";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Get all selected amenities
    const amenities = formData.getAll("amenities");
 
    const rooomid = Math.floor(Math.random() * 1000000)
    // Clean and validate data
    const finalData = {
      roomID: rooomid,
      roomName: data.roomName?.trim(),
      description: data.description?.trim(),
      image: data.image?.trim(),
      floor: data.floor?.trim(),
      capacity: parseInt(data.capacity) || 0,
      rate: data.rate?.trim(),
      amenities: amenities,
      bookings: parseInt(data.bookings) || 0,
      createdAt: new Date().toISOString()
    };

    // Validate required fields
    if (!finalData.roomName) {
      toast.error("Room name is required");
      setIsLoading(false);
      return;
    }

    if (!finalData.image) {
      toast.error("Image URL is required");
      setIsLoading(false);
      return;
    }

    try {
      const authHeaders = await getAuthHeaders();

      const [addRoomRes, addListedRes] = await Promise.all([
        fetch(`${API_URL}/add-rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(finalData),
        }),
        fetch(`${API_URL}/listed-room-add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(finalData),
        }),
      ]);

      if (addRoomRes.ok && addListedRes.ok) {
        toast.success("Room Added Successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        e.target.reset(); // Reset form
        // Reset checkboxes manually
        const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
      } else {
        const error1 = !addRoomRes.ok ? await addRoomRes.text() : "";
        const error2 = !addListedRes.ok ? await addListedRes.text() : "";
        console.error("Add room error:", error1, error2);
        toast.error("Failed to Add Room. Please try again.");
      }
    } catch (err) {
      console.error("Server error:", err);
      toast.error("Network error. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <form
        onSubmit={onsubmit}
        className="w-full max-w-2xl bg-gray-900 text-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold">🏠 Add New Room</h2>

        <div>
          <Label>Room Name *</Label>
          <Input 
            name="roomName" 
            placeholder="e.g. Research Lab Suite"
            required
            className="mt-1 text-gray-300"
          />
        </div>
         

        <div>
          <Label>Description</Label>
          <TextArea 
            name="description" 
            placeholder="Describe the room..." 
            className="mt-1"
          />
        </div>

        <div>
          <Label>Initial Bookings</Label>
          <Input 
            name="bookings" 
            type="number" 
            placeholder="0"
            min="0"
            className="mt-1 text-gray-300"
          />
        </div>

        <div>
          <Label>Image URL *</Label>
          <Input 
            name="image" 
            placeholder="https://example.com/room-image.jpg"
            required
            className="mt-1 text-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Floor</Label>
            <Input name="floor" placeholder="e.g., 5th Floor" className="mt-1 text-gray-300" />
          </div>

          <div>
            <Label>Capacity (people)</Label>
            <Input 
              name="capacity" 
              type="number"
              placeholder="6"
              min="1"
              className="mt-1 text-gray-300"
            />
          </div>

          <div>
            <Label>Rate</Label>
            <Input name="rate" placeholder="$16/hr" className="mt-1 text-gray-300" />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Whiteboard" /> 
              <span>Whiteboard</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Projector" /> 
              <span>Projector</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Wi-Fi" /> 
              <span>Wi-Fi</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Power Outlets" /> 
              <span>Power Outlets</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Quiet Zone" /> 
              <span>Quiet Zone</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="amenities" value="Air Conditioning" /> 
              <span>Air Conditioning</span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
        >
          {isLoading ? "Adding Room..." : "Add Room"}
        </Button>
      </form>
    </div>
  );
};

export default Page;