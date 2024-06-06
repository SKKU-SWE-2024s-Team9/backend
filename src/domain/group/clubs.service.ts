import { encryptPassword, generateSalt } from "../../lib/passport/validation";
import { prisma } from "../../prisma";
import { ClubCreateDto, ClubUpdateDto } from "./group.dto";

export const CreateClub = async (clubData: ClubCreateDto) => {
  try {
    const tagsString = clubData.tags.join(",");

    const club = await prisma.$transaction(async (prisma) => {
      const createdGroup = await prisma.group.create({
        data: {
          name: clubData.groupName,
          logoUrl: clubData.logoUrl,
          description: clubData.description,
          email: clubData.email,
          homepageUrl: clubData.homepageUrl,
          tags: tagsString,
          representativeName: clubData.representativeName,
          approved: "PENDING",
        },
      });

      const createdClub = await prisma.club.create({
        data: {
          location: clubData.location,
          numMembers: clubData.numMembers,
          group: {
            connect: { id: createdGroup.id },
          },
        },
      });

      const salt = await generateSalt();
      const key = await encryptPassword(clubData.password, salt);
      const user = await prisma.user.create({
        data: {
          name: clubData.username,
          password: key,
          salt,
          activated: false,
          group: {
            connect: { id: createdGroup.id },
          },
          role: "USER",
        },
      });

      return createdClub;
    });
    return club;
  } catch (error) {
    throw error;
  }
};

export const UpdateClub = async (clubId: number, clubData: ClubUpdateDto) => {
  try {
    const tagsString = clubData.tags.join(",");

    // check if the group is club
    let club = await prisma.club.findUnique({
      where: { groupId: clubId },
    });
    if (!club) {
      throw new Error("The group is not a club.");
    }

    club = await prisma.$transaction(async (prisma) => {
      const updatedGroup = await prisma.group.update({
        where: { id: clubId },
        data: {
          name: clubData.groupName,
          logoUrl: clubData.logoUrl,
          description: clubData.description,
          tags: tagsString,
          representativeName: clubData.representativeName,
        },
      });

      const updatedClub = await prisma.club.update({
        where: { groupId: clubId },
        data: {
          location: clubData.location,
          numMembers: clubData.numMembers,
        },
      });

      return updatedClub;
    });
    return club;
  } catch (error) {
    throw error;
  }
};
