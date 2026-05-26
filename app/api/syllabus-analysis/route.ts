import { NextResponse } from "next/server";

type AiSummary = {
  courseOverview: string;
  topics: string[];
  dates: string[];
  assignments: string[];
  exams: string[];
  studyRecommendations: string[];
};

const SUMMARY_PROMPT = `Extract a syllabus study summary as JSON.
Return only an object with these keys:
- courseOverview: concise course overview
- topics: array of major topics or modules
- dates: array of important dates with labels when available
- assignments: array of assignments with due dates or grading notes when available
- exams: array of quizzes, midterms, finals, or other exams
- studyRecommendations: array of practical study recommendations based on workload, topics, dates, assignments, and exams`;

const emptySummary: AiSummary = {
  courseOverview: "",
  topics: [],
  dates: [],
  assignments: [],
  exams: [],
  studyRecommendations: [],
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeSummary(value: unknown): AiSummary {
  const parsed = value && typeof value === "object" ? value : {};
  const candidate = parsed as Partial<Record<keyof AiSummary, unknown>>;

  return {
    courseOverview:
      typeof candidate.courseOverview === "string"
        ? candidate.courseOverview
        : "",
    topics: toStringArray(candidate.topics),
    dates: toStringArray(candidate.dates),
    assignments: toStringArray(candidate.assignments),
    exams: toStringArray(candidate.exams),
    studyRecommendations: toStringArray(candidate.studyRecommendations),
  };
}

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

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: "Analysis service is not configured." },
      { status: 502 },
    );
  }

  const openAiResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: SUMMARY_PROMPT,
          },
          {
            role: "user",
            content: syllabusText,
          },
        ],
      }),
    },
  );

  if (openAiResponse.status === 429) {
    return NextResponse.json(
      { message: "Too many analysis attempts." },
      { status: 429 },
    );
  }

  if (!openAiResponse.ok) {
    return NextResponse.json(
      { message: "Analysis service is unavailable." },
      { status: 502 },
    );
  }

  const completion = (await openAiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = completion.choices?.[0]?.message?.content ?? "{}";
  const aiSummary = normalizeSummary(JSON.parse(content));

  return NextResponse.json({
    ...aiSummary,
    summary: aiSummary.courseOverview,
    nextStep: "Review extracted topics, dates, assignments, exams, and recommendations.",
  });
}
