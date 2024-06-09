import express from "express";
import { prisma } from "../../prisma";
import { sendMail } from "../../util/mail";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../../util/status-code";

const router = express.Router();

interface FormResponse {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  email: string;
  homepageUrl?: string;
  tags: string;
  representativeName?: string;
  logoUrl: string;
}

interface LabFormResponse extends FormResponse {
  professor: string;
  googleScholarUrl: string;
  numPostDoc: number;
  numPhd: number;
  numMaster: number;
  numUnderGraduate: number;
  roomNo: string;
  campus: string;
}

interface ClubFormResponse extends FormResponse {
  numMembers: number;
  location: string;
}

router.get("/forms", async (req, res) => {
  const groups = await prisma.group.findMany({
    where: { approved: { in: ["PENDING", "UPDATED"] } },
    include: {
      Club: true,
      Lab: true,
    },
  });

  const forms = {
    lab: [] as LabFormResponse[],
    club: [] as ClubFormResponse[],
  };
  groups.forEach((group) => {
    const form = {
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      email: group.email,
      homepageUrl: group.homepageUrl,
      tags: group.tags,
      representativeName: group.representativeName,
    };
    if (group.Lab) {
      forms.lab.push({
        ...form,
        professor: group.Lab.professor,
        googleScholarUrl: group.Lab.googleScholarUrl,
        numPostDoc: group.Lab.numPostDoc,
        numPhd: group.Lab.numPhd,
        numMaster: group.Lab.numMaster,
        numUnderGraduate: group.Lab.numUnderGraduate,
        roomNo: group.Lab.roomNo,
        campus: group.Lab.campus,
        logoUrl: group.logoUrl,
      });
    } else if (group.Club) {
      forms.club.push({
        ...form,
        numMembers: group.Club.numMembers,
        location: group.Club.location,
        logoUrl: group.logoUrl,
      });
    }
  });

  res.status(OK).json(forms);
});

router.post("/approve", async (req, res) => {
  const groupId = req.body.groupId;
  try {
    const updatedGroup = await prisma.$transaction(async (prisma) => {
      const group = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          approved: "APPROVED",
        },
        select: {
          name: true,
          email: true,
        },
      });
      await prisma.user.update({
        where: {
          groupId: groupId,
        },
        data: {
          activated: true,
        },
      });
      return group;
    });
    await sendMail({
      to: updatedGroup.email,
      subject: "신청하신 단체가 승인되었습니다.",
      html: `<p><b>신청하신 단체[${updatedGroup.name}]가 승인되었습니다.</b><br> 
기존에 생성하신 계정으로 로그인이 가능합니다.<br><br>
감사합니다.<br>
clabu 드림</p>`,
    });
    res.status(OK).end();
  } catch (e) {
    console.error(e);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to approve group",
      message: (e as Error).message,
    });
  }
});

router.post("/decline", async (req, res) => {
  const groupId = req.body.groupId as number;
  const description = req.body.description as string;

  try {
    const targetGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        name: true,
        email: true,
        approved: true,
      },
    });

    if (targetGroup) {
      await sendMail({
        to: targetGroup.email,
        subject: "신청하신 단체가 승인되지 않았습니다.",
        html: `<p><b>신청하신 단체[${
          targetGroup.name
        }]의 승인이 거절되었습니다.</b><br>
${
  description ? `사유: ${description}<br>` : ``
}관련 문의사항은 clabumanager@gmail.com으로 메일 주시기 바랍니다. <br><br>
감사합니다.<br>clabu 드림</p>`,
      });

      await prisma.$transaction(async (prisma) => {
        if (targetGroup.approved == "PENDING") {
          await prisma.group.delete({
            where: {
              id: groupId,
            },
          });
          await prisma.user.delete({
            where: {
              groupId: groupId,
            },
          });
        } else if (targetGroup.approved == "UPDATED") {
          await prisma.group.delete({
            where: {
              id: groupId,
            },
          });
        }
      });
      res.status(OK).end();
    } else {
      res.status(NOT_FOUND).end();
    }
  } catch (e) {
    console.error(e);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to decline group",
      message: (e as Error).message,
    });
  }
});

export default router;
