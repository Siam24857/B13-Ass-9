"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, ChevronDown, BookOpen } from "lucide-react";
import { authClient, useSession } from "../lib/auth-client";

export default function Navbar() {
 const { data: session } = useSession();

 const user = session?.user
  return (
    <nav className="w-full border-b border-[#1b2a3a] bg-[#08111f] text-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">

        {/* LEFT LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5ead7]">
            <BookOpen className="h-5 w-5 text-black" />
          </div>

          <h1 className="text-2xl font-bold tracking-wide">
            StudyNook
          </h1>
        </Link>

        {/* CENTER MENU */}
        <div className="hidden items-center gap-10 md:flex">
          <Link href="/">Home</Link>
          <Link href="/rooms">Rooms</Link>
          <Link href="/add-room">Add Room</Link>
          <Link href="/my-listings">My Listings</Link>
          <Link href="/my-bookings">My Bookings</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          <button className="rounded-full p-2 hover:bg-[#132235]">
            <Moon className="h-5 w-5 text-gray-300" />
          </button>

          {/* USER */}
          {user ? (
            <div className="flex items-center gap-3">

              <Image
                src={user.image || "https://i.pravatar.cc/100"}
                alt="profile"
                width={44}
                height={44}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full border-2 border-yellow-400 object-cover"
              />

              <div className="hidden md:flex items-center gap-1">
                <span className="text-[16px] font-semibold">
                  {user.name}
                </span>

              
              </div>
              <button onClick={async() => await authClient.signOut()} className="font-semibold text-yellow-400 hover:underline btn btn-active">Log Out</button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-semibold text-yellow-400 hover:underline btn btn-active"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}