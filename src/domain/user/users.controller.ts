import express from "express";
import { prisma } from "../../prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    where: { activated: true },
    select: {
      name: true,
      group: true,
      activated: true,
    },
  });
  res.status(200).json(users);
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const user = await prisma.user.findFirst({
    where: { name: username },
    select: {
      name: true,
      group: true,
      activated: true,
    },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});

router.get("/me", async (req, res) => {
  if (req.user) {
    const { id } = req.user;
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        name: true,
        group: true,
        activated: true,
      },
    });
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});

export default router;
