export interface UserCreateDto {
  name: string;
  password: string;
  role: string;
  groupId?: number;
  manager?: boolean;
}
