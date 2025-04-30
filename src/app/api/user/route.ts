import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Creates a new user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request.
 * @returns {NextResponse} - JSON response with user data or error.
 */
export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, volunteerDetails } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          code: "EMAIL_ALREADY_EXISTS",
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const savedUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    await prisma.volunteerDetails.create({
      data: {
        ...volunteerDetails,
        userId: savedUser.id,
      },
    });

    await prisma.code.create({
      data: {
        codeString: "",
        expire: new Date(),
        userId: savedUser.id,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `User created with email: ${savedUser.email}`,
        data: savedUser,
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

/**
 * Deletes a user and its associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user ID.
 * @returns {NextResponse} - JSON response indicating success or error.
 */
export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Check if id is null
  if (!id) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "User ID is required.",
      },
      { status: 400 }
    );
  }

  // @TODO: If there is time figure out the logic for removing user while preserving previous time slots/sessions
  try {
    await prisma.$transaction(async (tx) => {
      // Delete TimeSlots where organizationId is null
      // await tx.timeSlot.deleteMany({
      //   where: {
      //     userId: id,
      //     organizationId: null,
      //   },
      // });

      // Delete VolunteerSessions where organizationId is null
      // await tx.volunteerSession.deleteMany({
      //   where: {
      //     userId: id,
      //     organizationId: null,
      //   },
      // });

      // For TimeSlots with organizationId, nullify userId
      // await tx.timeSlot.updateMany({
      //   where: {
      //     userId: id,
      //     NOT: {
      //       organizationId: null,
      //     },
      //   },
      //   data: {
      //     userId: undefined, // nullify userId
      //   },
      // });

      // For VolunteerSessions with organizationId, nullify userId
      // await tx.volunteerSession.updateMany({
      //   where: {
      //     userId: id,
      //     NOT: {
      //       organizationId: null,
      //     },
      //   },
      //   data: {
      //     userId: undefined, // nullify userId
      //   },
      // });

      await tx.timeSlot.deleteMany({
        where: { userId: id },
      });

      await tx.volunteerSession.deleteMany({
        where: { userId: id },
      });

      // Delete related Code
      await tx.code.deleteMany({
        where: { userId: id },
      });

      // Delete related VolunteerDetails
      await tx.volunteerDetails.deleteMany({
        where: { userId: id },
      });

      // Delete the User
      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "User deleted successfully",
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

/**
 * Fetches a user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user ID.
 * @returns {NextResponse} - JSON response with user and volunteerDetails or error.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id: string | undefined = searchParams.get("id") || undefined;
  const email: string | undefined = searchParams.get("email") || undefined;
  const role: string | undefined = searchParams.get("role") || undefined;
  const date: string | undefined = searchParams.get("date") || undefined;

  if (!id && !email && !role && !date) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "User ID is required.",
      },
      { status: 400 }
    );
  }

  if (role) {
    try {
      const users = await prisma.user.findMany({
        where: { role: role === "ADMIN" ? "ADMIN" : "VOLUNTEER" },
        include: {
          volunteerDetails: role === "VOLUNTEER",
          volunteerSessions: role === "VOLUNTEER",
        },
      });

      if (!users || users.length === 0) {
        return NextResponse.json(
          {
            code: "NOT_FOUND",
            message: "No users found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          code: "SUCCESS",
          data: users,
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

  if (date) {
    try {
      const [year, month, day] = date.split("-").map(Number);
      const start = new Date(year, month - 1, day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const usersWithSlots = await prisma.user.findMany({
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
          volunteerDetails: true,
          organization: true,
        },
      });

      return NextResponse.json(
        {
          code: "SUCCESS",
          data: usersWithSlots,
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

  try {
    const fetchedUser = await prisma.user.findUnique({
      where: id ? { id } : { email },
      include: {
        volunteerDetails: true,
        volunteerSessions: true,
        organization: true,
      },
    });

    if (!fetchedUser) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: fetchedUser,
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

/**
 * Updates a user and associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user and volunteerDetails data.
 * @returns {NextResponse} - JSON response with updated data or error.
 */

export const PATCH = async (request: NextRequest) => {
  try {
    const { user, volunteerDetails } = await request.json();

    const {
      id,
      volunteerDetails: _,
      volunteerSessions: __,
      organizationId: ___,
      organizationName,
      ...userWithoutRelations
    } = user;

    const organization =
      organizationName?.trim() !== ""
        ? await prisma.organization.findFirst({
            where: {
              normalizedName: organizationName.trim().toLowerCase(),
            },
          })
        : null;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...userWithoutRelations,
        ...(organization
          ? { organization: { connect: { id: organization.id } } }
          : { organization: { disconnect: true } }),
        volunteerDetails: volunteerDetails
          ? {
              update: {
                ageOver14: volunteerDetails.ageOver14,
                firstTime: volunteerDetails.firstTime,
                country: volunteerDetails.country,
                address: volunteerDetails.address,
                city: volunteerDetails.city,
                state: volunteerDetails.state,
                zipCode: volunteerDetails.zipCode,
                hasLicense: volunteerDetails.hasLicense,
                speaksEsp: volunteerDetails.speaksEsp,
                whyJoin: volunteerDetails.whyJoin,
                comments: volunteerDetails.comments,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `User updated with email: ${updatedUser.email}`,
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
