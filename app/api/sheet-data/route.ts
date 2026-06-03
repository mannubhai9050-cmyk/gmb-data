import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  try {
    const sheetName =
      req.nextUrl.searchParams.get("sheetName");

    if (!sheetName) {
      return NextResponse.json([]);
    }

    const sheets = await getSheetsClient();

    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId:
          process.env.GOOGLE_SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

    return NextResponse.json(
      response.data.values || []
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      [],
      {
        status: 500,
      }
    );
  }
}
