import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

const generateId = (length: number = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function POST(request: Request) {
  console.log("API: Received POST request to /api/pastes");
  try {
    const body = await request.json();
    console.log("API: Request body parsed", body);
    const { content, expiresIn, maxViews } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    const id = generateId();
    console.log("API: Generated ID:", id);
    let expiresAt: Date | null = null;

    if (expiresIn) {
      const expires = parseInt(expiresIn);
      if (!isNaN(expires)) {
        expiresAt = new Date(Date.now() + expires * 60 * 1000); // expiresIn is in minutes
      }
    }

    console.log("API: Attempting to create paste in DB...");
    const paste = await prisma.paste.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: maxViews ? parseInt(maxViews) : null,
      },
    });
    console.log("API: Paste created successfully:", paste.id);

    return NextResponse.json({
      id: paste.id,
      url: `/paste/${paste.id}`, // Frontend URL
    });
  } catch (error) {
    console.error("API Error creating paste:", error);
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 },
    );
  }
}
