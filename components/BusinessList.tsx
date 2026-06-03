"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  FaWhatsapp,
  FaCopy,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface Props {
  data: string[][];
}

export default function BusinessList({
  data,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [visibleItems, setVisibleItems] =
    useState(20);

  const rows = data?.slice(1) || [];

  const filteredRows =
    useMemo(() => {
      let filtered =
        rows.filter((row) =>
          row.some((cell) =>
            String(cell)
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
        );

      filtered.sort((a, b) => {
        const ratingA =
          Number(a[4]) || 0;

        const ratingB =
          Number(b[4]) || 0;

        return sortOrder ===
          "desc"
          ? ratingB - ratingA
          : ratingA - ratingB;
      });

      return filtered;
    }, [
      rows,
      search,
      sortOrder,
    ]);

  const displayedRows =
    filteredRows.slice(
      0,
      visibleItems
    );

  const exportExcel = () => {
    const worksheet =
      XLSX.utils.aoa_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Data"
    );

    XLSX.writeFile(
      workbook,
      "business-data.xlsx"
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border rounded-xl p-3 w-full lg:w-96"
        />

        <div className="flex gap-3">

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            className="border rounded-xl px-4"
          >
            <option value="desc">
              Rating High → Low
            </option>

            <option value="asc">
              Rating Low → High
            </option>
          </select>

          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-5 rounded-xl"
          >
            Export Excel
          </button>

        </div>

      </div>

      {/* Stats */}
      <div className="mb-6">

        <div className="bg-blue-50 rounded-2xl p-4">

          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <h2 className="text-3xl font-bold">
            {filteredRows.length}
          </h2>

        </div>

      </div>

      {/* Cards */}
      <div className="space-y-4">

        {displayedRows.map(
          (row, index) => {
            const [
              name,
              address,
              phone,
              website,
              rating,
              reviews,
              mapsUrl,
            ] = row;

            return (
              <div
                key={index}
                className="border rounded-2xl p-5 hover:shadow-lg transition bg-white"
              >

                <div className="flex flex-col lg:flex-row justify-between gap-4">

                  <div>

                    <h3 className="font-bold text-lg">
                      {name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {address}
                    </p>

                    <div className="flex gap-3 mt-3 flex-wrap">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        ⭐ {rating}
                      </span>

                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        {reviews} Reviews
                      </span>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {phone && (
                      <>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              phone
                            )
                          }
                          className="bg-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                          <FaCopy />
                          Copy
                        </button>

                        <a
                          href={`https://wa.me/${phone.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </a>
                      </>
                    )}

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <FaGlobe />
                        Website
                      </a>
                    )}

                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <FaMapMarkerAlt />
                        Maps
                      </a>
                    )}

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* Infinite Scroll Button */}
      {visibleItems <
        filteredRows.length && (
        <div className="text-center mt-8">

          <button
            onClick={() =>
              setVisibleItems(
                (prev) =>
                  prev + 20
              )
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Load More
          </button>

        </div>
      )}

    </div>
  );
}