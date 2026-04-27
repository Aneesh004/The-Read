import BookClient from "./BookClient";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookClient bookId={id} />;
}
