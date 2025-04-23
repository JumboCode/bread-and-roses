import { PrismaClient, TimeSlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Creates a new user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request.
 * @returns {NextResponse} - JSON response with user data or error.
 */
export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { volunteerSession } = await request.json();
    const { userId, dateWorked, timeSlotId } = volunteerSession;

    const parsedDateWorked = new Date(dateWorked);
    const startOfDay = new Date(parsedDateWorked);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDateWorked);
    endOfDay.setHours(23, 59, 59, 999);

    const openSession = await prisma.volunteerSession.findFirst({
      where: {
        userId,
        checkOutTime: null,
        durationHours: null,
        dateWorked: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (openSession) {
      return NextResponse.json(
        {
          code: "ALREADY_CHECKED_IN",
          message: "User is already checked in and has not checked out.",
        },
        { status: 400 }
      );
    }

    // Check if user has a time slot for the current day before allowing check-in
    const timeSlot = await prisma.timeSlot.findFirst({
      where: { id: timeSlotId },
    });

    if (
      !timeSlot ||
      timeSlot.userId !== userId ||
      timeSlot.date.toISOString().slice(0, 10) !==
        parsedDateWorked.toISOString().slice(0, 10)
    ) {
      return NextResponse.json(
        {
          code: "INVALID_TIME_SLOT",
          message:
            "Time slot is invalid, not associated with user, or does not match today's date.",
        },
        { status: 400 }
      );
    }

    if (timeSlot.status !== "AVAILABLE") {
      return NextResponse.json(
        {
          code: "TIME_SLOT_USED",
          message: "Time slot has already been used or checked in.",
        },
        { status: 400 }
      );
    }

    const newSession = await prisma.volunteerSession.create({
      data: {
        ...volunteerSession,
        timeSlotId,
      },
    });

    await prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        status: TimeSlotStatus.CHECKED_IN,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `Volunteer session created for user ${userId} successfully.`,
        data: newSession,
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
  const userId: string | undefined = searchParams.get("userId") || undefined;

  if (!userId) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "User ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const volunteerSessions = await prisma.volunteerSession.findMany({
      where: {
        userId: userId,
        NOT: [{ checkOutTime: null }, { durationHours: null }],
      },
    });

    if (!volunteerSessions) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: "No volunteer sessions found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: volunteerSessions,
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
};

export const PATCH = async (request: NextRequest) => {
  try {
    const { userId } = await request.json();

    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const activeSession = await prisma.volunteerSession.findFirst({
      where: {
        userId,
        checkOutTime: null,
        durationHours: null,
        dateWorked: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        {
          code: "ALREADY_CHECKED_OUT",
          message: "User has already checked out or has no active session.",
        },
        { status: 400 }
      );
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(activeSession.checkInTime);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    const updatedSession = await prisma.volunteerSession.update({
      where: {
        id: activeSession.id,
      },
      data: {
        checkOutTime,
        durationHours,
      },
    });

    if (activeSession.timeSlotId) {
      await prisma.timeSlot.update({
        where: { id: activeSession.timeSlotId },
        data: { status: TimeSlotStatus.COMPLETED },
      });
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `User ${userId} checked out successfully.`,
        data: updatedSession,
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
