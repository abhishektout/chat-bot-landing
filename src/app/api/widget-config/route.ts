import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.API_KEY || "ast_dev_key_123456789";
  const widgetUrl = process.env.NEXT_PUBLIC_WIDGET_URL || "https://chat-umaxx.a4tool.com";
  return NextResponse.json({ apiKey, widgetUrl });
}
