import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function EditorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNew = !id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      loadSheet();
    }
  }, [id]);

  async function loadSheet() {
    const { data, error } = await supabase
      .from("cheat_sheets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      navigate("/");
      return;
    }
    setTitle(data.title);
    setContent(data.content);
  }

  async function handleSave() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    setSaving(true);

    if (isNew) {
      const { error } = await supabase.from("cheat_sheets").insert({
        title: title.trim(),
        content,
        user_id: user!.id,
      });
      if (!error) navigate("/");
    } else {
      const { error } = await supabase
        .from("cheat_sheets")
        .update({ title: title.trim(), content, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (!error) navigate("/");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <button
          className="inline-flex items-center gap-2 border-none rounded-lg px-3.5 py-2 text-sm font-medium cursor-pointer transition-all duration-200 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          onClick={() => navigate("/")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
            <button
              className={`border-none rounded-md px-3.5 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${
                !showPreview
                  ? "bg-slate-700 text-slate-100 shadow-sm"
                  : "bg-transparent text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => setShowPreview(false)}
            >
              Edit
            </button>
            <button
              className={`border-none rounded-md px-3.5 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${
                showPreview
                  ? "bg-slate-700 text-slate-100 shadow-sm"
                  : "bg-transparent text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
          </div>
          <button
            className="inline-flex items-center gap-2 border-none rounded-xl px-5 py-2 text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-[960px] w-full mx-auto p-6">
        <input
          type="text"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-3.5 text-slate-100 text-xl font-semibold mb-4 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-slate-800/70 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-600"
          placeholder="Cheat sheet title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {showPreview ? (
          <div className="markdown-preview flex-1 bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 text-slate-200 leading-relaxed overflow-y-auto">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-slate-600 italic">Nothing to preview yet...</p>
            )}
          </div>
        ) : (
          <textarea
            className="flex-1 min-h-[500px] bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-slate-200 font-mono text-sm leading-relaxed resize-y outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-600"
            placeholder="Write your markdown here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}
      </main>
    </div>
  );
}
