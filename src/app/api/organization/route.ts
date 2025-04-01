import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth (?) */

    const { organization } = await request.json();

    const savedorganization = await prisma.organization.create({
      data: organization,
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: savedorganization.name,
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
    const organizationID = searchParams.get("id");
  
    try {
      if (organizationID) {
        const fetchedOrganization = await prisma.organization.findUnique({
          where: { id: organizationID },
        });
  
        if (!fetchedOrganization) {
          return NextResponse.json(
            { code: "NOT_FOUND", message: "No organization found" },
            { status: 404 }
          );
        }
  
        return NextResponse.json(
          { code: "SUCCESS", data: fetchedOrganization },
          { status: 200 }
        );
      } else {
        const fetchedOrganizations = await prisma.organization.findMany();
        return NextResponse.json(
          { code: "SUCCESS", data: fetchedOrganizations },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return NextResponse.json(
        { code: "ERROR", message: "An error occurred while fetching organizations" },
        { status: 500 }
      );
    }
  };
