import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "VOLUNTEER" | "ADMIN";
      firstName: string;
      lastName: string;
      email: string;
      volunteerDetails?: VolunteerDetails | null;
    };
  }

  interface User {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    volunteerDetails?: VolunteerDetails | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    volunteerDetails?: VolunteerDetails | null;
  }
}

interface VolunteerDetails {
  ageOver14: boolean;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hasLicense: boolean;
  speaksEsp: boolean;
  volunteerType: string;
  hoursWorked: number;
}
