"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlay,
  FaPlus,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [category, setCategory] =
    useState("");

  const [sheets, setSheets] =
    useState<string[]>([]);

  const [selectedSheet, setSelectedSheet] =
    useState("");

  const [newSheetName, setNewSheetName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    loadSheets();
  }, []);

  async function loadSheets() {
    try {
      const res = await fetch(
        "/api/sheets"
      );

      const data =
        await res.json();

      setSheets(data);

      if (
        data.length &&
        !selectedSheet
      ) {
        setSelectedSheet(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createSheet() {
    if (!newSheetName) {
      alert("Enter Sheet Name");
      return;
    }

    const res = await fetch(
      "/api/create-sheet",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          sheetName:
            newSheetName,
        }),
      }
    );

    const data =
      await res.json();

    if (data.success) {
      await loadSheets();

      setSelectedSheet(
        newSheetName
      );

      setNewSheetName("");

      alert(
        "Sheet Created Successfully"
      );
    } else {
      alert(data.error);
    }
  }

  async function startScraping() {
    if (
      !city ||
      !category ||
      !selectedSheet
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      setStatus(
        "Running Scraper..."
      );

      const res = await fetch(
        "/api/scraper",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            city,
            category,
            sheetName:
              selectedSheet,
          }),
        }
      );

      await res.json();

      setStatus(
        "Completed Successfully"
      );
    } catch (error) {
      console.error(error);

      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      {/* Header */}

      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          darkMode
            ? "bg-slate-950/90 border-slate-800"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              GMB Dashboard
            </h1>

            <p
              className={`mt-1 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Google Business Lead Generator
            </p>
          </div>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition ${
              darkMode
                ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                : "border-slate-300 bg-white hover:bg-slate-100"
            }`}
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-8">
        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-5 mb-6">
          <div
            className={`rounded-3xl p-5 border shadow-xl ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <p className="text-sm opacity-70">
              Total Sheets
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {sheets.length}
            </h2>
          </div>

          <div
            className={`rounded-3xl p-5 border shadow-xl ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <p className="text-sm opacity-70">
              Selected Sheet
            </p>

            <h2 className="text-lg font-semibold truncate mt-2">
              {selectedSheet || "-"}
            </h2>
          </div>

          <div
            className={`rounded-3xl p-5 border shadow-xl ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <p className="text-sm opacity-70">
              Status
            </p>

            <h2 className="text-lg font-semibold mt-2">
              {loading
                ? "Running"
                : "Ready"}
            </h2>
          </div>

          <div
            className={`rounded-3xl p-5 border shadow-xl ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <p className="text-sm opacity-70">
              Scraper
            </p>

            <h2 className="text-lg font-semibold text-green-500 mt-2">
              Active
            </h2>
          </div>
        </div>

        {/* Scraper Form */}

        <div
          className={`rounded-3xl p-8 border shadow-xl mb-6 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="grid md:grid-cols-3 gap-5">
            <input
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              className={`w-full rounded-2xl px-4 py-3 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-200"
              }`}
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className={`w-full rounded-2xl px-4 py-3 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-200"
              }`}
            />

            <select
              value={
                selectedSheet
              }
              onChange={(e) =>
                setSelectedSheet(
                  e.target.value
                )
              }
              className={`w-full rounded-2xl px-4 py-3 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-200"
              }`}
            >
              {sheets.map(
                (sheet) => (
                  <option
                    key={sheet}
                    value={sheet}
                  >
                    {sheet}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={
                startScraping
              }
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition flex items-center gap-3"
            >
              <FaPlay />

              {loading
                ? "Running..."
                : "Start Scraping"}
            </button>
          </div>

          {status && (
            <div
              className={`mt-5 rounded-2xl p-4 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-green-50 border-green-200"
              }`}
            >
              {status}
            </div>
          )}
        </div>

        {/* Create Sheet */}

        <div
          className={`rounded-3xl p-8 border shadow-xl mb-6 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3 className="font-bold text-xl mb-5">
            Create Sheet
          </h3>

          <div className="flex gap-3">
            <input
              value={
                newSheetName
              }
              onChange={(e) =>
                setNewSheetName(
                  e.target.value
                )
              }
              placeholder="Gurgaon_AC_Repair"
              className={`flex-1 rounded-2xl px-4 py-3 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-200"
              }`}
            />

            <button
              onClick={
                createSheet
              }
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 rounded-2xl font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <FaPlus />
              Create
            </button>
          </div>
        </div>

        {/* Sheets */}

        <div
          className={`rounded-3xl p-8 border shadow-xl ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3 className="font-bold text-xl mb-5">
            Sheets
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sheets.map(
              (sheet) => (
                <button
                  key={sheet}
                  onClick={() =>
                    router.push(
                      `/sheet-data?sheetName=${encodeURIComponent(
                        sheet
                      )}`
                    )
                  }
                  className={`rounded-2xl px-5 py-4 font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-800 border border-slate-700 hover:bg-blue-600"
                      : "bg-white border border-slate-200 hover:bg-blue-600"
                  } hover:text-white hover:shadow-lg`}
                >
                  {sheet}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}