"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import React from "react";

export default function NavBar({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.webp"
              alt="Fund Secure Logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            />
            <p>FundSecure</p>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <Link
              href="/create-gig"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Create Gig
            </Link>
            <Link
              href="/sponsor-showcase"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Sponsor Showcase
            </Link>
          </nav>

          {/* User Session Controls */}
          <div>
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
