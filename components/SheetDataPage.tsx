"use client";

import { useEffect, useState } from "react";

interface Props {
  sheetName: string;
}

export default function SheetDataPage({
  sheetName,
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadData();
  }, [sheetName]);

  async function loadData() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/sheet-data?sheetName=${encodeURIComponent(
          sheetName
        )}`
      );

      const data = await res.json();

      const header = data[0] || [];
      const body = data.slice(1);

      const seen = new Set();

      const uniqueRows = body.filter(
        (row: any[]) => {
          const placeId = row[7];

          if (!placeId) return true;

          if (seen.has(placeId)) {
            return false;
            }

          seen.add(placeId);

          return true;
        }
      );

    setRows([header, ...uniqueRows]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

function exportCSV() {
  const csv = rows
    .map((row: any[]) =>
      row
        .map((cell) =>
          `"${String(cell ?? "")
            .replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `${sheetName}.csv`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );
}
  const filteredRows =
    rows.filter((row: any[]) =>
      row
        .join(" ")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {sheetName}
            </h1>

            <p className="text-gray-500">
              Google Sheet Data
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-5 py-3 rounded-xl"
          >
            Download CSV
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border rounded-xl p-3 mb-6"
        />

        {loading ? (
          <div>
            Loading...
          </div>
        ) : (
          <div className="overflow-auto rounded-2xl border">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left w-56">
                    NAME
                  </th>

                  <th className="px-4 py-4 text-left w-72">
                    ADDRESS
                  </th>

                  <th className="px-4 py-4 text-left w-40">
                    PHONE
                  </th>

                  <th className="px-4 py-4 text-left w-40">
                    WEBSITE
                  </th>

                  <th className="px-4 py-4 text-left w-24">
                    RATING
                  </th>

                  <th className="px-4 py-4 text-left w-32">
                    REVIEWS
                  </th>

                  <th className="px-4 py-4 text-left w-40">
                    MAPS_URL
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows
                  .slice(1)
                  .map(
                    (
                      row: any[],
                      index
                    ) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 w-56">
                          <div className="line-clamp-3">
                            {row[0]}
                          </div>
                        </td>

                        <td className="px-4 py-4 w-72">
                          <div className="line-clamp-2">
                            {row[1]}
                          </div>
                        </td>

                        <td className="px-4 py-4 w-40">
                          {row[2]}
                        </td>

                        <td className="px-4 py-4 w-40">
                          {row[3] ? (
                            <a
                              href={row[3]}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="px-4 py-4 w-24">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            ⭐ {row[4]}
                          </span>
                        </td>

                        <td className="px-4 py-4 w-32">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {row[5]} Reviews
                          </span>
                        </td>

                        <td className="px-4 py-4 w-40">
                          {row[6] ? (
                            <a
                              href={row[6]}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open Map
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}