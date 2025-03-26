import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can access this endpoint" }, { status: 403 });
    }
    
    // Find all parents linked to this student
    const linkedParents = await prisma.scholarLink.findMany({
      where: {
        scholarId: session.user.id,
        status: "VERIFIED"
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    // Format response
    const formattedParents = linkedParents.map(link => ({
      id: link.parent.id,
      name: link.parent.name,
      email: link.parent.email,
      image: link.parent.image,
      linkedSince: link.verifiedAt
    }));
    
    return NextResponse.json({ parents: formattedParents });
    
  } catch (error) {
    console.error("Error fetching linked parents:", error);
    return NextResponse.json({ error: "Failed to fetch linked parents" }, { status: 500 });
  }
}
