import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookId, value, title, author, coverImage } = await req.json();

    if (!bookId || !value) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Step 1: Ensure Book exists in local DB
    let book = await prisma.book.findUnique({
      where: { googleBooksId: bookId }
    });

    if (!book) {
      // First person to rate this book, so create it in our db
      book = await prisma.book.create({
        data: {
          googleBooksId: bookId,
          title: title || "Unknown Title",
          author: author || "Unknown Author",
          coverImage: coverImage
        }
      });
    }

    // Step 2: Upsert Rating
    const userId = (session.user as any).id as string;
    
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id
        }
      }
    });

    if (existingRating) {
       await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value }
      });
    } else {
       await prisma.rating.create({
        data: {
          value,
          userId,
          bookId: book.id
        }
      });
    }

    return NextResponse.json({ message: "Rating saved" }, { status: 200 });

  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const googleBooksId = searchParams.get("bookId");

    if (!googleBooksId) {
      return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { googleBooksId },
      include: {
        ratings: true
      }
    });

    if (!book || !book.ratings || book.ratings.length === 0) {
      return NextResponse.json({ distribution: [] });
    }

    const dist: Record<string, number> = {
      "skip": 0,
      "okish": 0,
      "good_read": 0,
      "must_read": 0
    };

    book.ratings.forEach(r => {
      if (dist[r.value] !== undefined) {
        dist[r.value]++;
      }
    });

    return NextResponse.json({ distribution: dist, total: book.ratings.length });

  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
