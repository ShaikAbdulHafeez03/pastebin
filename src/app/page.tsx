"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          expiresIn: expiresIn || undefined,
          maxViews: maxViews || undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(data.url);
      } else {
        alert("Error: " + (data.error || "Failed to create paste"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pastebin</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Share text and code snippets instantly.</p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium">
                New Paste
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here..."
                  className="w-full h-96 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-2">
                <label htmlFor="expiration" className="block text-sm font-medium">
                  Expiration
                </label>
                <select
                  id="expiration"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">Never</option>
                  <option value="1">1 Minute</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="1440">1 Day</option>
                  <option value="10080">1 Week</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxViews" className="block text-sm font-medium">
                  Burn after views (Optional)
                </label>
                <input
                  type="number"
                  id="maxViews"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="e.g., 5"
                  min="1"
                  className="w-full p-2.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Creating..." : "Create Paste"}
              </button>
            </div>
          </form>
        </main>

        <footer className="mt-16 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Pastebin Clone. Built with Next.js & Prisma.</p>
        </footer>
      </div>
    </div>
  );
}
