import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bloggerUrlsString = process.env.NEXT_PUBLIC_BLOGGER_URL || "";
    const bloggerUrls = bloggerUrlsString
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    if (bloggerUrls.length === 0) {
      return NextResponse.json({ error: "No Blogger URLs configured." }, { status: 500 });
    }

    // Fetch all blog feeds in parallel
    const responses = await Promise.all(
      bloggerUrls.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.json();
      })
    );

    return NextResponse.json({ blogs: responses });
  }catch (err) { 
    console.error("API /blogs error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch blogs";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
