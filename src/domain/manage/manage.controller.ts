import express from "express";
import { prisma } from "../../prisma";
import { mailSend } from "../../util/mail";

const router = express.Router();

router.get("/forms", async (req, res) => {

  let forms = [];
  await prisma.group.findMany({
    where: {
      OR: [
        { approved: "PENDING" },
        { approved: "UPDATED" }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  }).then((groups) => {
    groups.forEach((group) => {
      forms.push(group);
    });
  });

  res.status(200).json(forms);

});

router.post("/approve", async (req, res) => {
  const groupId = req.body.groupId;

  try {
    let updatedGroup;
    await prisma.$transaction(async (prisma) => {
      updatedGroup = await prisma.group.update({
        where: {
          id: groupId
        },
        data: {
          approved: "APPROVED"
        },
        select: {
          name: true,
          email: true
        }
      });
      await prisma.user.update({
        where: {
          groupId: groupId
        },
        data: {
          activated: true
        }
      });
    });
    await mailSend({
      to: updatedGroup.email,
      subject: "신청하신 단체가 승인되었습니다.",
      html: `<p><b>신청하신 단체[` + updatedGroup.name + `]가 승인되었습니다.</b><br> 
            기존에 생성하신 계정으로 로그인이 가능합니다.<br><br>
            감사합니다.<br>
            clabu 드림</p>`
    });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to approve group", message: e.message });
  }
});

router.post("/decline", async (req, res) => {
  const groupId = req.body.groupId;
  const description = req.body.description;

  try {
    const targetGroup = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      select: {
        name: true,
        email: true
      }
    });
  
    await mailSend({
      to: targetGroup.email,
      subject: "신청하신 단체가 승인되지 않았습니다.",
      html: `<p><b>신청하신 단체[` + targetGroup.name + `]의 승인이 거절되었습니다.</b><br> `
        + (description ? `사유: ` + description + `<br>`: ``) 
        + `관련 문의사항은 clabumanager@gmail.com으로 메일 주시기 바랍니다. <br><br>
        감사합니다.<br>clabu 드림</p>`
    });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to decline group", message: e.message });
  }
  
});

export default router;