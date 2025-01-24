import { User, VolunteerDetails } from "@prisma/client";

export type UserWithVolunteerDetail = User & {
    volunteerDetails?: VolunteerDetails;
};