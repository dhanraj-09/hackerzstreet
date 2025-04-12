"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const authenticated = false;
  useEffect(() => {
    if (authenticated) redirect("/login");
  });
  return <div></div>;
}
