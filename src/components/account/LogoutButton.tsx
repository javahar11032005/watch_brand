"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <button
      onClick={async () => {
        await logout();
        router.push("/");
        router.refresh();
      }}
      className="text-xs tracking-[0.2em] uppercase text-ink/70 hover:text-brass transition-colors focus-ring"
    >
      Log Out
    </button>
  );
}
