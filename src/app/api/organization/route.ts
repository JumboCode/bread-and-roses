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

export const GET = async () => {
  try {
    const fetchedOrganizations = await prisma.organization.findMany();

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
