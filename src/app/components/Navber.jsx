"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, BookOpen } from "lucide-react";
import { authClient, useSession } from "../lib/auth-client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const user = session?.user;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Add Room", path: "/add-room" },
    { name: "My Listings", path: "/my-listroom" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

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
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`group relative pb-1 text-[15px] font-medium transition-all duration-300
                ${
                  pathname === link.path
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
            >
              {link.name}

              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-yellow-400 transition-all duration-300
                  ${
                    pathname === link.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* Theme Button */}
          

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

              <div className="hidden items-center gap-1 md:flex">
                <span className="text-[16px] font-semibold">
                  {user.name}
                </span>
              </div>

              <button
                onClick={async () => await authClient.signOut()}
                className="rounded-lg border border-yellow-400 px-4 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-yellow-400 px-4 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}