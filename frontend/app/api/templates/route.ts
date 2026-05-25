import { NextResponse } from "next/server";
import templateData from "@/assets/templates.json";

export async function GET() {
  return NextResponse.json(templateData);
}
