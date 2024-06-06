import express from "express";
import { prisma } from "../../prisma";
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../../util/status-code";
import { CreateClub, UpdateClub } from "./clubs.service";
import {
  ClubCreateDto,
  ClubUpdateDto,
  LabCreateDto,
  LabUpdateDto,
} from "./group.dto";
import { CreateLab, UpdateLab } from "./labs.service";

const router = express.Router();

router.get("/labs", async (req, res) => {
  const keyword = req.query.keyword as string;

  let labs = null;
  if (keyword) {
    labs = await prisma.lab.findMany({
      where: {
        group: {
          approved: "APPROVED",
          OR: [
            {
              tags: {
                contains: keyword,
              },
            },
            {
              name: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        },
      },
      select: {
        professor: true,
        googleScholarUrl: true,
        numPostDoc: true,
        numPhd: true,
        numMaster: true,
        numUnderGraduate: true,
        roomNo: true,
        campus: true,
        group: {
          select: {
            id: true,
            representativeName: true,
            name: true,
            logoUrl: true,
            description: true,
            email: false,
            homepageUrl: false,
            tags: true,
            approved: false,
          },
        },
      },
    });
  } else {
    labs = await prisma.lab.findMany({
      where: {
        group: {
          approved: "APPROVED",
        },
      },
      select: {
        professor: true,
        googleScholarUrl: true,
        numPostDoc: true,
        numPhd: true,
        numMaster: true,
        numUnderGraduate: true,
        roomNo: true,
        campus: true,
        group: {
          select: {
            id: true,
            representativeName: true,
            name: true,
            logoUrl: true,
            description: true,
            email: false,
            homepageUrl: false,
            tags: true,
            approved: false,
          },
        },
      },
    });
  }

  if (labs) {
    let reslabs: any[] = [];
    labs.map((lab) => {
      const { group, ...labData } = lab;
      const result = { ...group, ...labData };
      reslabs.push(result);
    });

    res.status(OK).json(reslabs);
  } else {
    res.status(NOT_FOUND).end();
  }
});

router.get("/labs/:labId", async (req, res) => {
  const labId = Number(req.params.labId);
  const lab = await prisma.lab.findFirst({
    where: {
      groupId: labId,
      group: {
        approved: "APPROVED",
      },
    },
    select: {
      professor: true,
      googleScholarUrl: true,
      numPostDoc: true,
      numPhd: true,
      numMaster: true,
      numUnderGraduate: true,
      roomNo: true,
      campus: true,
      group: {
        select: {
          id: true,
          representativeName: true,
          name: true,
          logoUrl: true,
          description: true,
          email: true,
          homepageUrl: true,
          tags: true,
          approved: true,
        },
      },
    },
  });

  if (lab) {
    const { group, ...labData } = lab;
    const result = { ...group, ...labData };

    res.status(OK).json(result);
  } else {
    res.status(NOT_FOUND).end();
  }
});

router.post("/labs", async (req, res) => {
  try {
    const labCreateDto: LabCreateDto = req.body;
    const lab = await CreateLab(labCreateDto);
    res.status(CREATED).json(lab.groupId);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to create lab",
      message: (error as Error).message,
    });
  }
});

router.put("/labs/:labId", async (req, res) => {
  try {
    const groupId = Number(req.params.labId);
    const labUpdateDto: LabUpdateDto = req.body;
    const lab = await UpdateLab(groupId, labUpdateDto);
    res.status(OK).json(lab.groupId);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to update lab",
      message: (error as Error).message,
    });
  }
});

router.get("/clubs", async (req, res) => {
  const keyword = req.query.keyword as string;

  let clubs = null;
  if (keyword) {
    clubs = await prisma.club.findMany({
      where: {
        group: {
          approved: "APPROVED",
          OR: [
            {
              tags: {
                contains: keyword,
              },
            },
            {
              name: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        },
      },
      select: {
        location: true,
        numMembers: true,
        group: {
          select: {
            id: true,
            representativeName: true,
            name: true,
            logoUrl: true,
            description: true,
            email: false,
            homepageUrl: false,
            tags: true,
            approved: false,
          },
        },
      },
    });
  } else {
    clubs = await prisma.club.findMany({
      where: {
        group: {
          approved: "APPROVED",
        },
      },
      select: {
        location: true,
        numMembers: true,
        group: {
          select: {
            id: true,
            representativeName: true,
            name: true,
            logoUrl: true,
            description: true,
            email: false,
            homepageUrl: false,
            tags: true,
            approved: false,
          },
        },
      },
    });
  }

  if (clubs) {
    let resclubs: any[] = [];
    clubs.map((club) => {
      const { group, ...clubData } = club;
      const result = { ...group, ...clubData };
      resclubs.push(result);
    });

    res.status(OK).json(resclubs);
  }
});

router.get("/clubs/:clubId", async (req, res) => {
  const clubId = Number(req.params.clubId);
  const club = await prisma.club.findFirst({
    where: {
      groupId: clubId,
      group: {
        approved: "APPROVED",
      },
    },
    select: {
      location: true,
      numMembers: true,
      group: {
        select: {
          id: true,
          representativeName: true,
          name: true,
          logoUrl: true,
          description: true,
          email: true,
          homepageUrl: true,
          tags: true,
          approved: true,
        },
      },
    },
  });

  if (club) {
    const { group, ...clubData } = club;
    const result = { ...group, ...clubData };

    res.status(OK).json(result);
  } else {
    res.status(NOT_FOUND).end();
  }
});

router.post("/clubs", async (req, res) => {
  try {
    const clubCreateDto: ClubCreateDto = req.body;
    const club = await CreateClub(clubCreateDto);
    res.status(CREATED).json(club.groupId);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to create club",
      message: (error as Error).message,
    });
  }
});

router.put("/clubs/:clubId", async (req, res) => {
  try {
    const groupId = Number(req.params.clubId);
    const clubUpdateDto: ClubUpdateDto = req.body;
    const club = await UpdateClub(groupId, clubUpdateDto);
    res.status(OK).json(club.groupId);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({
      error: "Failed to update club",
      message: (error as Error).message,
    });
  }
});

export default router;
