import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Optional: type for your table row
export type UploadRow = {
  id?: string;
  original_name: string;
  storage_path: string;
  public_url: string | null;
  size: number;
  type: string | null;
  slot?: string; // <- add this
};

const UploadFile: React.FC = () => {
  const primary =
    "brand-gradient-text";

  // ---- THEME STATE ----
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    AOS.init({ duration: 800, offset: 80, once: false });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const saved = localStorage.getItem("theme");
      if (!saved) setDarkMode(mql.matches);
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // ---- UPLOAD STATE ----
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setMessage(null);
    setProgress(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage("Please choose a file first.");
      return;
    }

    setIsUploading(true);
    setProgress(100);
    setMessage("Upload is disabled because Supabase was removed.");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    setIsUploading(false);
  };

  return (
    <div
      className={`min-h-lvh flex justify-center items-center p-4 transition-colors ${
        darkMode
          ? "bg-neutral-950 text-neutral-100"
          : "bg-neutral-50 text-neutral-900"
      }`}
    >
      {/* Theme toggle (optional) */}
      <button
        type="button"
        onClick={() => setDarkMode((v) => !v)}
        className="fixed top-4 right-4 rounded-xl border px-3 py-1.5 text-sm shadow
                   border-neutral-300 bg-white hover:bg-neutral-100
                   dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        aria-label="Toggle theme"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border shadow p-6 backdrop-blur
                   bg-white/70 border-neutral-200
                   dark:bg-neutral-900/60 dark:border-neutral-700"
      >
        <div>
          <label htmlFor="resume-input" className={`font-semibold ${primary}`}>
            Upload Resume
          </label>
          <input
            ref={inputRef}
            id="resume-input"
            type="file"
            required
            onChange={onFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="mt-2 block w-full rounded-md border-2 p-2.5 outline-none
                       bg-white text-neutral-900 border-teal-500
                       focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                       dark:bg-neutral-800 dark:text-neutral-100 dark:border-teal-500
                       dark:placeholder-neutral-400"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="mt-4 w-full rounded-xl border px-3 py-2 transition-colors
                     border-teal-600 text-teal-800 hover:bg-teal-600 hover:text-white
                     disabled:opacity-60 disabled:cursor-not-allowed
                     dark:text-teal-300 dark:hover:text-white"
        >
          {isUploading ? "Uploading…" : "Submit"}
        </button>

        {isUploading && (
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-2 rounded-full bg-teal-600 transition-[width]"
                style={{ width: `${progress}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                role="progressbar"
              />
            </div>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
              {progress}%
            </p>
          </div>
        )}

        {message && (
          <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-200" role="status">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadFile;
