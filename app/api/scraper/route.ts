import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const {
      city,
      category,
      sheetName,
    } = body;

    const response = await fetch(
      process.env.N8N_WEBHOOK_URL!,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          city,
          category,
          sheetName,
        }),
      }
    );

    const data =
      await response.json();

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to run scraper",
      },
      {
        status: 500,
      }
    );
  }
}