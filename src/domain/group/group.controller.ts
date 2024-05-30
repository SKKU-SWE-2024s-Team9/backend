import express from 'express';
import { prisma } from '../../prisma';
import { LabCreateDto, LabUpdateDto } from './group.dto';
import { CreateLab, UpdateLab } from './labs.service';

const router = express.Router();

router.get('/labs', async (req, res) => {
  const keyword = req.query.keyword;

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
        numPostDoc: true,
        numPhd: true,
        numMaster: true,
        numUnderGraduate: true,
        roomNo: true,
        campus: true,
        group: {
          select: {
            id: true,
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
        numPostDoc: true,
        numPhd: true,
        numMaster: true,
        numUnderGraduate: true,
        roomNo: true,
        campus: true,
        group: {
          select: {
            id: true,
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
      const result = { ...group, ...labData};
      reslabs.push(result);
    });

    res.status(200).json(reslabs);
  } else {
    res.status(404).end();
  }

});

router.get('/labs/:labId', async (req, res) => {
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
      numPostDoc: true,
      numPhd: true,
      numMaster: true,
      numUnderGraduate: true,
      roomNo: true,
      campus: true,
      group: {
        select: {
          id: true,
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
    const result = { ...group, ...labData};

    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
});

router.post('/labs', async (req, res) => {
  const labCreateDto: LabCreateDto = req.body;
  // use service
  const lab = await CreateLab(labCreateDto);

  if (lab) {
    res.status(201).json(lab);
  } else {
    res.status(404).end();
  }
});

router.put('/labs/:labId', async (req, res) => {
  const groupId = Number(req.params.labId);
  const labUpdateDto: LabUpdateDto = req.body;

  const lab = await UpdateLab(groupId, labUpdateDto);

  if (lab) {
    res.status(200).json(lab);
  } else {
    res.status(404).end();
  }
});

export default router;