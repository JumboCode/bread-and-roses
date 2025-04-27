import { PrismaClient, TimeSlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { sendGroupSignupMail } from "../../../lib/groupSignupMail";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { timeSlot, groupSignupInfo } = await request.json();

    const newTimeSlot = await prisma.timeSlot.create({
      data: {
        userId: timeSlot.userId,
        organizationId: timeSlot.organizationId ?? null,
        startTime: new Date(timeSlot.startTime),
        endTime: new Date(timeSlot.endTime),
        durationHours: timeSlot.durationHours,
        date: new Date(timeSlot.date),
        approved: timeSlot.approved,
      },
    });

    if (timeSlot.organizationId && groupSignupInfo) {
      await sendGroupSignupMail(groupSignupInfo);
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Time Slot Created",
        data: newTimeSlot,
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
  const date: string | undefined = searchParams.get("date") || undefined;
  const status: string | undefined = searchParams.get("status") || undefined;

  if (!userId && !date && !status) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Missing fields",
      },
      { status: 400 }
    );
  }

  try {
    const slots = await prisma.timeSlot.findMany({
      where: {
        ...(userId && { userId }),
        ...(date && {
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        }),
        ...(status && { status: status as TimeSlotStatus }),
      },
    });
    return NextResponse.json(
      {
        code: "SUCCESS",
        data: slots,
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

export const DELETE = async (request: NextRequest) => {
  const { userId, startTime, endTime } = await request.json();

  if (!userId || !startTime || !endTime) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Missing fields" },
      { status: 400 }
    );
  }

  try {
    await prisma.timeSlot.deleteMany({
      where: {
        userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(
      { code: "SUCCESS", message: "Deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return NextResponse.json(
      { code: "ERROR", message: error },
      { status: 500 }
    );
  }
};
