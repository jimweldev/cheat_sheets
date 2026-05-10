import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { CheatSheet } from "../types";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [sheets, setSheets] = useState<CheatSheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSheets();
  }, []);

  async function fetchSheets() {
    const { data, error } = await supabase
      .from("cheat_sheets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setSheets(data);
    }
    setLoading(false);
  }

  async function deleteSheet(id: string) {
    if (!confirm("Delete this cheat sheet?")) return;
    const { error } = await supabase.from("cheat_sheets").delete().eq("id", id);
    if (!error) {
      setSheets((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-slate-100 text-lg font-semibold m-0 tracking-tight">Cheat Sheets</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm hidden sm:inline">{user?.email}</span>
          <button
            className="border-none rounded-lg px-3.5 py-2 text-sm font-medium cursor-pointer transition-all duration-200 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-[1080px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-slate-100 text-2xl font-bold m-0 tracking-tight">Your Sheets</h2>
            <p className="text-slate-500 text-sm m-0 mt-1">
              {sheets.length} {sheets.length === 1 ? "sheet" : "sheets"}
            </p>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer no-underline transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Sheet
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-slate-500">
            <div className="animate-pulse text-lg">Loading...</div>
          </div>
        ) : sheets.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg m-0 mb-1">No cheat sheets yet</p>
            <p className="text-slate-600 text-sm m-0">Create your first one to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className="group relative bg-slate-800/40 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/50 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5"
              >
                <Link
                  to={`/edit/${sheet.id}`}
                  className="block p-5 no-underline text-inherit"
                >
                  <h3 className="text-slate-100 font-semibold m-0 mb-2.5 text-base tracking-tight">
                    {sheet.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed m-0 mb-4 break-words line-clamp-3">
                    {sheet.content.slice(0, 150)}
                    {sheet.content.length > 150 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(sheet.updated_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </Link>
                <button
                  className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 bg-transparent border-none text-slate-600 cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => deleteSheet(sheet.id)}
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
