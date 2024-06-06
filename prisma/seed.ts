import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../src/prisma";
import { createUser } from "../src/domain/user/users.service";

async function main() {
  console.log("Start seeding...");

  const manager = await createUser({
    name: "clabu",
    password: "clabUA1!@",
    role: "MANAGER",
  });

  const lab = await prisma.lab.create({
    data: {
      campus: "자연과학캠퍼스",
      numMaster: 5,
      numPhd: 0,
      numPostDoc: 0,
      numUnderGraduate: 0,
      professor: "차수영",
      roomNo: "제2공학관27동 3층 27318호실",
      googleScholarUrl:
        "https://scholar.google.co.kr/citations?user=Ye0pjlAAAAAJ",
      group: {
        create: {
          name: "소프트웨어 분석 연구실",
          description: `성균관대학교 소프트웨어 분석 연구실에서는 기계-학습 기법들을 통해 안전한 소프트웨어를 만드는 연구를 함께 수행할 학생을 모집합니다. 관심 있으신 학생은 제 이메일(sooyoung.cha@skku.edu)로 연락 주시면 됩니다.


학부 연구원 모집

기본적으로는 대학원 진학에 관심이 있는 3,4 학년 학부 연구원을 모집합니다.

연구원 기간 동안 저와 정기적인 미팅을 통해 연구의 기반을 준비하고 구체적인 연구 주제를 선정합니다.

요구되는 자질: 성실성, 호기심 및 열정, 기본적인 코딩 실력.   


대학원 신입생 모집

저에게 간단한 자기 소개서와 학부 성적 증명서를 메일로 보내주신 후 저와 개인 면담을 진행합니다.  

제 연구실은 대학원 입학 전에 인턴 기간을 거쳐야 하므로 입학하는 시기보다 미리 연락을 해주세요. 


연구 환경 

대학원생 등록금 및 생활비 지원. (학부 연구원 인건비 지원).

개인 컴퓨터, 서버 등 쾌적한 연구에 필요한 장비 지원. 

소프트웨어 공학 분야 TOP-4 국제 학회 참석 지원. (ICSE, FSE, ASE, ISSTA)`,
          email: "sooyoung.cha@skku.edu",
          homepageUrl: "https://sal.skku.edu",
          logoUrl: "/image/skku.png",
          tags: "소프트웨어 공학,소프트웨어 분석",
          representativeName: "차수영",
          approved: "APPROVED",
        },
      },
    },
  });
  const labLeader = await createUser({
    name: "swecha",
    password: "skkuA1!@",
    role: "LEADER",
    groupId: lab.groupId,
  });

  const club = await prisma.club.create({
    data: {
      location: "성균관대학교 삼성학술정보관 2층 솦:콤존 격물 480214",
      numMembers: 40,
      group: {
        create: {
          name: "MAV",
          description: `👀 성균관대학교 소프트웨어융합대학 동아리 MAV에서 신입부원을 모집합니다! 👀
* 기존 VR/AR Studio에서 명칭이 변경되었습니다.
* 휴식 인원 중 활동 재개를 희망하시는 분은 카카오톡 공식 채널로 문의 바랍니다.

🤔 MAV는 어떤 동아리인가요?
⇒ MAV는 Metaverse AR/VR의 줄임말로, 메타버스와 증강현실 및 가상현실 기술을 탐구하며, 더 나아가 게임 컨텐츠, XR 및 실감형 미디어 콘텐츠 등 다양한 분야에서의 프로젝트를 진행하는 소프트웨어학과 동아리입니다. 학기 중에는 유니티 게임 엔진 스터디와 함께 팀 프로젝트를 병행하며, 콘텐츠 제작을 위한 최신 기술을 배울 수 있는 비교과 프로그램을 진행하기도 합니다.

🤔 MAV는 어떤 사람들을 찾고 있나요?
⇒ 아래 사항 중 하나라도 해당된다면 MAV의 인재상!!
* 가상현실 환경 구현이나 게임 개발에 관심이 많다!
* 메타버스를 아우르는 신기술을 자세히 알고 싶다!
* 자신이 상상하던 아이디어를 다함께 실현시켜 보고 싶다!
* 솦융대 선배 / 동기들과 함께 즐거운 학기를 보내고 싶다!

🤔 MAV는 무슨 활동들을 하나요?
⇒ 저희가 하는 활동들은 다음과 같습니다!
VR 기기인 Oculus Quest 2 & HTC VIVE와 풀트래킹 장비를 통해 자유롭게 VR 콘텐츠를 체험하며 즐깁니다!
Unity, Blender, VFX, Git 등의 개발 툴 스터디를 진행하여 개발 실력을 쑥쑥 늘릴 수 있습니다!
팀 프로젝트를 진행하여 자신의 아이디어를 팀원들과 함께 실현시킬 수 있습니다!
선후배와의 커뮤니케이션 및 친목 활동으로 전반적인 개발 프로세스를 배우고 함께 즐거운 학교 생활을 보냅니다!

* 팀 프로젝트 진행 시간은 매주 수요일 오후 6시 ~ 7시로 고정되어 있습니다. 지원 시 참고 부탁드립니다.

🤔 MAV에 들어가면 받을 수 있는 혜택이 있나요?
⇒ MAV가 부원분들께 제공하는 혜택은 다음과 같습니다!
팀 프로젝트 진행 시에 필요한 온라인 강의나 에셋 비용을 지원해드립니다!
삼성학술정보관 에 위치한 동방을 자유롭게 이용하실 수 있습니다!
XR / 실감형 미디어 콘텐츠 제작 기업과 함께하는 비교과 프로그램에 우선적으로 참여할 수 있습니다!`,
          email: "dalpengx3@g.skku.edu",
          homepageUrl: "https://skku-mav.github.io/MAV",
          logoUrl: "/image/mav_logo.png",
          tags: "게임,컴퓨터 그래픽스,메타버스,VR,AR,XR",
          representativeName: "박정휴",
          approved: "APPROVED",
        },
      },
    },
  });
  const clubLeader = await createUser({
    name: "mav",
    password: "mavmavA1!@",
    role: "LEADER",
    groupId: club.groupId,
  });

  await prisma.user.updateMany({
    data: {
      activated: true,
    },
    where: {
      id: {
        in: [manager.id, clubLeader.id, labLeader.id],
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
