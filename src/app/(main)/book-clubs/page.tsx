import BookClubsClient from "@/components/book-clubs/BookClubsClient";

export const metadata = {
  title: "Book Clubs | Reading & Rambles",
  description: "Join or start a book club to discuss your favorite reads.",
};

export default function BookClubsPage() {
  return (
    <div className="min-h-screen py-24 bg-[#09070A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Book Clubs
          </h1>
          <p className="font-sans text-lg text-text-secondary">
            Find your tribe. Read together.
          </p>
        </div>
        <BookClubsClient />
      </div>
    </div>
  );
}
