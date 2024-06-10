import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../src/prisma";
import { createUser } from "../src/domain/user/users.service";
import { ClubCreateDto, LabCreateDto } from "../src/domain/group/group.dto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function seedClub(clubInfo: ClubCreateDto) {
  const tag =
    typeof clubInfo.tags == "string" ? clubInfo.tags : clubInfo.tags.join(",");
  const club = await prisma.club.create({
    data: {
      location: clubInfo.location,
      numMembers: clubInfo.numMembers,
      group: {
        create: {
          name: clubInfo.groupName,
          description: clubInfo.description,
          email: clubInfo.email,
          homepageUrl: clubInfo.homepageUrl,
          logoUrl: clubInfo.logoUrl,
          tags: tag,
          representativeName: clubInfo.representativeName,
          approved: "APPROVED",
        },
      },
    },
  });
  const clubLeader = await createUser({
    name: clubInfo.username,
    password: clubInfo.password,
    role: "LEADER",
    groupId: club.groupId,
  });
  return { club, clubLeader };
}
async function seedLab(labInfo: LabCreateDto) {
  const tag =
    typeof labInfo.tags == "string" ? labInfo.tags : labInfo.tags.join(",");
  const lab = await prisma.lab.create({
    data: {
      campus: labInfo.campus,
      numMaster: labInfo.numMaster,
      numPhd: labInfo.numPhd,
      numPostDoc: labInfo.numPostDoc,
      numUnderGraduate: labInfo.numUnderGraduate,
      professor: labInfo.professor,
      roomNo: labInfo.roomNo,
      googleScholarUrl: labInfo.googleScholarUrl,
      group: {
        create: {
          name: labInfo.groupName,
          description: labInfo.description,
          email: labInfo.email,
          homepageUrl: labInfo.homepageUrl,
          logoUrl: labInfo.logoUrl,
          tags: tag,
          representativeName: labInfo.representativeName,
          approved: "APPROVED",
        },
      },
    },
  });
  const labLeader = await createUser({
    name: labInfo.username,
    password: labInfo.password,
    role: "LEADER",
    groupId: lab.groupId,
  });
  return { lab, labLeader };
}

async function main() {
  console.log("Start seeding...");

  const clubData = JSON.parse(
    readFileSync(join(__dirname, "club-seed.json"), "utf-8")
  );
  const labData = JSON.parse(
    readFileSync(join(__dirname, "lab-seed.json"), "utf-8")
  );

  console.log(clubData, labData);

  const manager = await createUser({
    name: "clabu",
    password: "clabUA1!@",
    role: "MANAGER",
  });

  const leaders: number[] = [];


  const clubPromises = clubData.map(async (data: ClubCreateDto) => {
    const { club, clubLeader } = await seedClub(data);
    return clubLeader.id;
  });
  const labPromises = labData.map(async (data: LabCreateDto) => {
    const { lab, labLeader } = await seedLab(data);
    return labLeader.id;
  });
  
  const clubLeaders = await Promise.all(clubPromises);
  const labLeaders = await Promise.all(labPromises);

  leaders.push(...clubLeaders, ...labLeaders);
  
  await prisma.user.updateMany({
    data: {
      activated: true,
    },
    where: {
      id: {
        in: [manager.id, ...leaders],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
