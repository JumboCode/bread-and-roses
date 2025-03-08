import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { event } = await request.json();

    const savedEvent = await prisma.event.create({
      data: event,
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: savedEvent.eventName,
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

export const PATCH = async (request: NextRequest) => {
  try {
    const { event } = await request.json();
    const { id, ...updateData } = event; // needed to prevent prisma update error: overwriting "id"
    
      const updatedEvent = await prisma.event.update({
        where: {
          id: event.id,
        },
        data: { 
          ...updateData, 
        },
      });
    return NextResponse.json(
      {
        code: "SUCCESS",
        message: updatedEvent.eventName,
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
  try {
    const { id } = await request.json();

    const deleteEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: deleteEvent.eventName,
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

// NOTE: Changed to fetch only one event
export const GET = async (request: NextRequest) => {
  // currently implemented for fetching all events
  // need to add filtering
  const { searchParams } = new URL(request.url);
  const eventId: string | undefined = searchParams.get("id") || undefined;

  try {
    // const fetchedEvents = await prisma.event.findMany(); // Use findMany to fetch all events

    if (eventId) {
      const fetchedEvent = await prisma.event.findUnique({
        where: {id: eventId}
      });
  

      if (!fetchedEvent) {
        return NextResponse.json(
          {
            code: "NOT_FOUND",
            message: "No event found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
      {
        code: "SUCCESS",
        data: fetchedEvent,
      },
      { status: 200 }
      );
    }
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: "An error occurred while fetching events",
      },
      { status: 500 }
    );
  }
};
