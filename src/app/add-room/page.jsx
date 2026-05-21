"use client";
import React from "react";
import { Button, Input, Label, TextArea, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import { authClient } from "../lib/auth-client";
import { API_URL } from "../lib/config";

const page = () => {
  const onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const amenities = formData.getAll("amenities");

    const finalData = {
      roomName: data.roomName,
      description: data.description,
      image: data.image,
      floor: data.floor,
      capacity: data.capacity,
      rate: data.rate, // raw value
      amenities,
      bookings: Number(data.bookings || 0),
    };

    try {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;

      const res1 = await fetch(`${API_URL}/add-rooms`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });

      const res2 = await fetch(`${API_URL}/listed-room-add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });

      if (res1.ok && res2.ok) {
        toast.success("Room Added Successfully", {
          position: "top-center",
        });
        e.target.reset();
      } else {
        toast.error("Failed to Add Room");
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <form
        onSubmit={onsubmit}
        className="w-full max-w-2xl bg-gray-900 text-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold">🏠 Room Details</h2>

        <div>
          <Label>Room Name</Label>
          <Input name="roomName" placeholder="e.g. Research Lab Suite" />
        </div>

        <div>
          <Label>Description</Label>
          <TextArea name="description" placeholder="Describe the room..." />
        </div>

        <div>
          <Label>Bookings</Label>
          <Input name="bookings" type="number" placeholder="0" />
        </div>

        <div>
          <Label>Image URL</Label>
          <Input name="image" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Floor</Label>
            <Input name="floor" placeholder="5th Floor" />
          </div>

          <div>
            <Label>Capacity</Label>
            <Input name="capacity" placeholder="Up to 6 people" />
          </div>

          <div>
            <Label>Rate</Label>
            <Input name="rate" placeholder="$16/hr" />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label><input type="checkbox" name="amenities" value="Whiteboard" /> Whiteboard</label>
            <label><input type="checkbox" name="amenities" value="Projector" /> Projector</label>
            <label><input type="checkbox" name="amenities" value="Wi-Fi" /> Wi-Fi</label>
            <label><input type="checkbox" name="amenities" value="Power Outlets" /> Power Outlets</label>
            <label><input type="checkbox" name="amenities" value="Quiet Zone" /> Quiet Zone</label>
            <label><input type="checkbox" name="amenities" value="Air Conditioning" /> Air Conditioning</label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
        >
          Add Room
        </Button>
      </form>
    </div>
  );
};

export default page;