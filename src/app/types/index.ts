import {
  Organization,
  TimeSlot,
  User,
  VolunteerDetails,
  VolunteerSession,
} from "@prisma/client";

export type UserWithVolunteerDetail = User & {
  volunteerDetails?: VolunteerDetails;
  timeSlots?: TimeSlot[];
  volunteerSessions?: VolunteerSession[];
  organization?: Organization;
};

export type OrganizationWithUsers = Organization & {
  users?: User[];
  volunteerSessions?: VolunteerSession[];
};
