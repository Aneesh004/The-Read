import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("book_comments")
    .select("id, text, user_name, created_at")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bookId, text } = await req.json();

  if (!bookId || !text?.trim()) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const userName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Reader";

  const { error } = await supabase.from("book_comments").insert({
    book_id: bookId,
    user_id: user.id,
    user_name: userName,
    text: text.trim(),
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment posted" }, { status: 201 });
}
