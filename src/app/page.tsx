"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Playground from "@/components/playground";

function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      router.push("/login");
    } else {
      return setLoggedIn(true);
    }
  }, [router]);

  if (!loggedIn) {
    return "Checking Auth...";
  } else {
    return <Playground />;
  }
}

export default HomePage;
