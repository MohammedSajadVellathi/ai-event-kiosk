import { NextRequest, NextResponse } from "next/server";

// In-memory poll tracker (development mock only)
const sessions = new Map<string, { polls: number; createdAt: number }>();

const SUCCESS_AFTER_POLLS = 5; // ~15 seconds at 3s interval

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session") ?? "";

  const entry = sessions.get(sessionId) ?? { polls: 0, createdAt: Date.now() };
  entry.polls++;
  sessions.set(sessionId, entry);

  // Simulate payment success after enough polls
  const status = entry.polls >= SUCCESS_AFTER_POLLS ? "success" : "pending";

  return NextResponse.json({ status, polls: entry.polls });
}
