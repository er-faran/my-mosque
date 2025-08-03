import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "scheduled-messages.json");

export async function POST(req) {
  try {
    const { hour, minute, message } = await req.json();

    if (
      typeof hour !== "number" ||
      typeof minute !== "number" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existingRaw = await fs.readFile(filePath, "utf-8").catch(() => "[]");
    const existing = JSON.parse(existingRaw);

    const updated = [
      ...existing,
      { id: Date.now(), hour, minute, message: message.trim() },
    ];

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("Schedule error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
