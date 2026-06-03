import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheets";

export async function GET() {
  try {
    const sheets = await getSheetsClient();

    const response =
      await sheets.spreadsheets.get({
        spreadsheetId:
          process.env.GOOGLE_SPREADSHEET_ID,
      });

    const tabs =
      response.data.sheets?.map(
        (sheet) =>
          sheet.properties?.title
      ) || [];

    return NextResponse.json(tabs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch sheets",
      },
      {
        status: 500,
      }
    );
  }
}