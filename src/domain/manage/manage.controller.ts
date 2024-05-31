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
    lab: [] as FormResponse[],
    club: [] as FormResponse[],
  };
  groups.forEach((group) => {
    const form = {
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
    };
    if (group.Club) {
      forms.lab.push(form);
    } else if (group.Lab) {
      forms.club.push(form);
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
  const groupId = req.body.groupId;
  const description = req.body.description;

  try {
    const targetGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        name: true,
        email: true,
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
