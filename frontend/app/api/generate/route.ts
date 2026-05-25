import { NextRequest, NextResponse } from "next/server";

// Mock endpoint — replace with real AI generation service
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const image = form.get("image");

  if (!image) {
    return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
  }

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 3000));

  // Return the captured image as the "generated" result for demo purposes
  // Replace this logic with your actual AI service call
  const buffer = await (image as File).arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = (image as File).type || "image/jpeg";
  const dataUrl = `data:${mime};base64,${base64}`;

  return NextResponse.json({
    success: true,
    imageUrl: dataUrl,
  });
}
