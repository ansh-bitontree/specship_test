import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    syllabusText?: unknown;
  } | null;
  const syllabusText =
    typeof body?.syllabusText === "string" ? body.syllabusText.trim() : "";

  if (!syllabusText) {
    return NextResponse.json(
      { message: "Syllabus content is required." },
      { status: 400 },
    );
  }

  const lowerText = syllabusText.toLowerCase();

  if (lowerText.includes("rate limit")) {
    return NextResponse.json(
      { message: "Too many analysis attempts." },
      { status: 429 },
    );
  }

  if (lowerText.includes("api failure")) {
    return NextResponse.json(
      { message: "Analysis service is unavailable." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    summary: `Analyzed ${syllabusText.length} characters of syllabus content.`,
    nextStep: "Review extracted topics and dates before building your study plan.",
  });
}
