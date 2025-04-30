import { PrismaClient, TimeSlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { volunteerSession } = await request.json();
    const { userId, organizationId, dateWorked, timeSlotId } = volunteerSession;

    if (!userId && !organizationId) {
      return NextResponse.json(
        {
          code: "MISSING_IDS",
          message: "Either userId or organizationId must be provided.",
        },
        { status: 400 }
      );
    }

    const parsedDateWorked = new Date(dateWorked);
    const startOfDay = new Date(parsedDateWorked);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDateWorked);
    endOfDay.setHours(23, 59, 59, 999);

    // Check for duplicate active session (only for individuals)
    if (userId) {
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
    }

    const timeSlot = await prisma.timeSlot.findFirst({
      where: { id: timeSlotId },
    });

    if (!timeSlot) {
      return NextResponse.json(
        {
          code: "INVALID_TIME_SLOT",
          message: "Time slot does not exist.",
        },
        { status: 400 }
      );
    }

    const timeSlotDateStr = timeSlot.date.toISOString().slice(0, 10);
    const sessionDateStr = parsedDateWorked.toISOString().slice(0, 10);

    // Validate slot ownership
    if (
      (userId && timeSlot.userId !== userId) ||
      (organizationId && timeSlot.organizationId !== organizationId) ||
      timeSlotDateStr !== sessionDateStr
    ) {
      return NextResponse.json(
        {
          code: "INVALID_TIME_SLOT",
          message:
            "Time slot is not associated with the user/org or is for the wrong day.",
        },
        { status: 400 }
      );
    }

    if (timeSlot.status !== "AVAILABLE") {
      return NextResponse.json(
        {
          code: "TIME_SLOT_USED",
          message: "Time slot has already been used.",
        },
        { status: 400 }
      );
    }

    const newSession = await prisma.volunteerSession.create({
      data: {
        userId,
        organizationId,
        dateWorked: parsedDateWorked,
        checkInTime: new Date(),
        checkOutTime: null,
        durationHours: null,
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
        message: userId
          ? `Volunteer session created for user ${userId}.`
          : `Volunteer session created for organization ${organizationId}.`,
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

  try {
    if (userId) {
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
    }

    const volunteerSessions = await prisma.volunteerSession.findMany({
      where: {
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
    const { userId, organizationId } = await request.json();

    if (!userId && !organizationId) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "Either userId or organizationId must be provided.",
        },
        { status: 400 }
      );
    }

    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Find active session based on userId or organizationId
    const activeSession = await prisma.volunteerSession.findFirst({
      where: {
        checkOutTime: null,
        durationHours: null,
        dateWorked: {
          gte: startOfToday,
          lte: endOfToday,
        },
        ...(userId ? { userId } : { organizationId }),
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        {
          code: "ALREADY_CHECKED_OUT",
          message: "No active session found for user or organization.",
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
        message: `Checked out successfully.`,
        data: updatedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
