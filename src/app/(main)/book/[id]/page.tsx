import { notFound } from "next/navigation";
import { getBookById } from "@/lib/google-books";
import BookClient from "./BookClient";

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  // Pre-fetch ratings here or just let client fetch
  return (
    <div className="w-full">
      <BookClient book={book} />
    </div>
  );
}
