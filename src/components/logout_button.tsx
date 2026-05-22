"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  nome: string
}

export function LogoutButton({ nome }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-slate-300 text-sm">
        Olá, <span className="font-semibold text-white">{nome}</span>
      </span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sair
      </button>
    </div>
  );
}
