import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth (?) */

    const { userId, organizationName } = await request.json();

    const fetchedOrganization = await prisma.organization.findUnique({
      where: { name: organizationName },
    });

    let savedorganization = fetchedOrganization;

    if (!fetchedOrganization) {
      savedorganization = await prisma.organization.create({
        data: {name: organizationName},
      });  
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        organizationId: savedorganization?.id
      }
    })
    
    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Successfully created new organization",
        data: organizationName
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
