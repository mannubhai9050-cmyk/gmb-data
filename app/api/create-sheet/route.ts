import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheets";

// Browser test ke liye
export async function GET() {
  return NextResponse.json({
    status: "working",
    message: "Create Sheet API is running",
  });
}

// Sheet Create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sheetName } = body;

    if (!sheetName) {
      return NextResponse.json(
        {
          success: false,
          error: "Sheet name is required",
        },
        {
          status: 400,
        }
      );
    }

    const sheets = await getSheetsClient();

    // Existing sheets check
    const spreadsheet =
      await sheets.spreadsheets.get({
        spreadsheetId:
          process.env.GOOGLE_SPREADSHEET_ID,
      });

    const existingSheets =
      spreadsheet.data.sheets?.map(
        (sheet) =>
          sheet.properties?.title
      ) || [];

    if (existingSheets.includes(sheetName)) {
      return NextResponse.json(
        {
          success: false,
          error: "Sheet already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Create Sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId:
        process.env.GOOGLE_SPREADSHEET_ID,

      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sheet created successfully",
      sheetName,
    });
  } catch (error) {
    console.error("CREATE SHEET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sheet",
      },
      {
        status: 500,
      }
    );
  }
}