import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.API_KEY || "ast_dev_key_123456789";
  return NextResponse.json({ apiKey });
}
