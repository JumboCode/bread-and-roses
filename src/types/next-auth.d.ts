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
      organizationId?: string | null;
    };
  }

  interface User {
    id: string;
    role: "VOLUNTEER" | "ADMIN";
    firstName: string;
    lastName: string;
    email: string;
    volunteerDetails?: VolunteerDetails | null;
    rememberMe?: boolean;
    organizationId?: string | null;
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
    rememberMe?: boolean;
    organizationId?: string | null;
    exp: number;
    iat: number;
  }
}

interface VolunteerDetails {
  ageOver14: boolean;
  firstTime: boolean;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hasLicense: boolean;
  speaksEsp: boolean;
  volunteerType: string;
  hoursWorked: number;
  whyJoin: string;
  comments: string;
}
