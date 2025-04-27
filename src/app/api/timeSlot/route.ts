import { PrismaClient } from "@prisma/client";
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

  const userId = searchParams.get("userId");
  const date = searchParams.get("date");

  if (!userId || !date) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Missing fields",
      },
      { status: 400 }
    );
  }

  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  try {
    const slots = await prisma.timeSlot.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lt: end,
        },
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
