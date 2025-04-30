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
  const date: string | undefined = searchParams.get("date") || undefined;

  try {
    if (id) {
      const fetchedOrganization = await prisma.organization.findUnique({
        where: { id },
        include: {
          volunteerSessions: true,
          users: {
            include: {
              volunteerSessions: true,
            },
          },
        },
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

    if (date) {
      try {
        const [year, month, day] = date.split("-").map(Number);
        const start = new Date(year, month - 1, day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const orgsWithSlots = await prisma.organization.findMany({
          where: {
            timeSlots: {
              some: {
                date: {
                  gte: start,
                  lt: end,
                },
              },
            },
          },
          include: {
            timeSlots: {
              where: {
                date: {
                  gte: start,
                  lt: end,
                },
              },
            },
          },
        });

        return NextResponse.json(
          {
            code: "SUCCESS",
            data: orgsWithSlots,
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
          { status: 404 }
        );
      }
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

export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Organization ID is required." },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Nullify organizationId for Users
      await tx.user.updateMany({
        where: { organizationId: id },
        data: { organizationId: null },
      });

      // Nullify organizationId for TimeSlots
      await tx.timeSlot.updateMany({
        where: { organizationId: id },
        data: { organizationId: null },
      });

      // Nullify organizationId for VolunteerSessions
      await tx.volunteerSession.updateMany({
        where: { organizationId: id },
        data: { organizationId: null },
      });

      // Delete the Organization
      await tx.organization.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { code: "SUCCESS", message: "Organization deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { code: "ERROR", message: "Failed to delete organization." },
      { status: 500 }
    );
  }
};
