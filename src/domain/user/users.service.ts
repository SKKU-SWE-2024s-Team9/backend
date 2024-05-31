import { encryptPassword, generateSalt } from "../../lib/passport/validation";
import { prisma } from "../../prisma";
import { UserCreateDto } from "./users.dto";

export const createUser = async ({
  name,
  password,
  role,
  groupId,
}: UserCreateDto) => {
  try {
    const salt = await generateSalt();
    const key = await encryptPassword(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        password: key,
        salt,
        role,
        activated: false,
        groupId,
      },
    });
    return user;
  } catch (e) {
    throw e;
  }
};

export const activateUser = async (username: string) => {
  try {
    return await prisma.user.update({
      where: {
        name: username,
      },
      data: {
        activated: true,
      },
    });
  } catch (e) {
    throw e;
  }
};
