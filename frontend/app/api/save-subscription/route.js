import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    const filePath = path.resolve(process.cwd(), "subscription.json");

    // Save subscription data to local file
    fs.writeFileSync(filePath, JSON.stringify(body));

    return NextResponse.json({ message: "Subscription saved successfully" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
