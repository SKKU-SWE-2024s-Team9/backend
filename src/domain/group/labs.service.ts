import { encryptPassword, generateSalt } from "../../lib/passport/validation";
import { prisma } from "../../prisma";
import { LabCreateDto, LabUpdateDto } from "./group.dto";

export const CreateLab = async (labData: LabCreateDto) => {
  try {
    const tagsString = labData.tags.join(",");

    const lab = await prisma.$transaction(async (prisma) => {
      const createdGroup = await prisma.group.create({
        data: {
          name: labData.groupName,
          logoUrl: labData.logoUrl,
          description: labData.description,
          email: labData.email,
          homepageUrl: labData.homepageUrl,
          tags: tagsString,
          representativeName: labData.representativeName,
          approved: "PENDING",
        },
      });

      const createdLab = await prisma.lab.create({
        data: {
          professor: labData.professor,
          numPostDoc: labData.numPostDoc,
          numPhd: labData.numPhd,
          numMaster: labData.numMaster,
          numUnderGraduate: labData.numUnderGraduate,
          roomNo: labData.roomNo,
          campus: labData.campus,
          googleScholarUrl: labData.googleScholarUrl,
          group: {
            connect: { id: createdGroup.id },
          },
        },
      });

      // createUser 사용하려했는데, 오류를 마주치는 바람에..ㅠ
      // const createdUser = await createUser({
      //   name: labData.username,
      //   password: labData.password,
      //   groupId: createdGroup.id,
      // });

      const salt = await generateSalt();
      const key = await encryptPassword(labData.password, salt);
      const user = await prisma.user.create({
        data: {
          name: labData.username,
          password: key,
          salt,
          activated: false,
          group: {
            connect: { id: createdGroup.id },
          },
          role: "USER",
        },
      });

      return createdLab;
    });
    return lab;
  } catch (error) {
    throw error;
  }
};

export const UpdateLab = async (groupId: number, labData: LabUpdateDto) => {
  try {
    const tagsString = labData.tags.join(",");

    const lab = await prisma.$transaction(async (prisma) => {
      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          name: labData.groupName,
          logoUrl: labData.logoUrl,
          description: labData.description,
          email: labData.email,
          homepageUrl: labData.homepageUrl,
          tags: tagsString,
          representativeName: labData.representativeName,
          approved: "UPDATED",
        },
      });

      const updatedLab = await prisma.lab.update({
        where: { groupId: groupId },
        data: {
          professor: labData.professor,
          numPostDoc: labData.numPostDoc,
          numPhd: labData.numPhd,
          numMaster: labData.numMaster,
          numUnderGraduate: labData.numUnderGraduate,
          roomNo: labData.roomNo,
          campus: labData.campus,
          googleScholarUrl: labData.googleScholarUrl,
        },
      });

      return updatedLab;
    });
    return lab;
  } catch (error) {
    throw error;
  }
};
