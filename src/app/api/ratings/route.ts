import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bookId, value, title, author, coverImage } = await req.json();

  if (!bookId || !value) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("ratings").upsert(
    {
      user_id: user.id,
      book_id: bookId,
      value,
      book_title: title,
      book_author: author,
      book_cover: coverImage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,book_id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Rating saved" }, { status: 200 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: ratings, error } = await supabase
    .from("ratings")
    .select("value")
    .eq("book_id", bookId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!ratings || ratings.length === 0) {
    return NextResponse.json({ distribution: {}, total: 0 });
  }

  const dist: Record<string, number> = { skip: 0, okish: 0, good_read: 0, must_read: 0 };
  ratings.forEach((r) => {
    if (dist[r.value] !== undefined) dist[r.value]++;
  });

  return NextResponse.json({ distribution: dist, total: ratings.length });
}
