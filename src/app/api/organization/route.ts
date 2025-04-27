import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { userId, organizationName } = await request.json();
    const normalizedName = organizationName.trim().toLowerCase();

    let savedOrganization = await prisma.organization.findUnique({
      where: { normalizedName },
    });

    if (!savedOrganization) {
      savedOrganization = await prisma.organization.create({
        data: {
          name: organizationName.trim(),
          normalizedName,
        },
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: savedOrganization.id },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Organization saved",
        data: savedOrganization.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error,
      },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const id: string | undefined = searchParams.get("id") || undefined;

  try {
    if (id) {
      const fetchedOrganization = await prisma.organization.findUnique({
        where: { id },
        include: { volunteerSessions: true, users: true },
      });

      if (!fetchedOrganization) {
        return NextResponse.json(
          {
            code: "NOT_FOUND",
            message: "Organization not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          code: "SUCCESS",
          data: fetchedOrganization,
        },
        { status: 200 }
      );
    }

    const fetchedOrganizations = await prisma.organization.findMany({
      include: {
        users: true,
        volunteerSessions: {
          select: {
            durationHours: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Successfully fetched organizations",
        data: fetchedOrganizations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error,
      },
      { status: 500 }
    );
  }
};
