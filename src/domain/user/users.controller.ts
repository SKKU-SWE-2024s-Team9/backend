import express from "express";
import { prisma } from "../../prisma";
import { NOT_FOUND, OK } from "../../util/status-code";

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
  res.status(OK).json(users);
});

router.get("/me", async (req, res) => {
  console.log();
  if (req.user) {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        group: true,
        activated: true,
      },
    });
    res.status(OK).json(user);
  } else {
    res.status(NOT_FOUND).end();
  }
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const user = await prisma.user.findUnique({
    where: { name: username },
    select: {
      name: true,
      group: true,
      activated: true,
    },
  });
  if (user) {
    res.status(OK).json(user);
  } else {
    res.status(NOT_FOUND).end();
  }
});

export default router;
