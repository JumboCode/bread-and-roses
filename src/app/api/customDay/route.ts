import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { date, startTime, endTime, title, description } =
      await request.json();

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const existing = await prisma.customDay.findFirst({
      where: {
        date: {
          gte: normalizedDate,
          lt: new Date(normalizedDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    let result;
    if (existing) {
      result = await prisma.customDay.update({
        where: { id: existing.id },
        data: { startTime, endTime, title, description },
      });
    } else {
      result = await prisma.customDay.create({
        data: {
          date: normalizedDate,
          startTime,
          endTime,
          title,
          description,
        },
      });
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `Custom Day created for date: ${result.date}`,
        data: result,
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
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        {
          code: "BAD_REQUEST",
          message: "Missing fields",
        },
        { status: 400 }
      );
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(queryDate.getDate() + 1);

    const customDay = await prisma.customDay.findFirst({
      where: {
        date: {
          gte: queryDate,
          lt: nextDay,
        },
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: customDay,
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
