//enum campus type (자과캠 / 인사캠)
enum CampusType {
  NC = "자연과학캠퍼스",
  IC = "인문사회캠퍼스",
}

export interface GroupCreateDto {
  groupName: string;
  logoUrl: string;
  description: string;
  email: string;
  homepageUrl: string;
  tags: string[];
  representativeName: string;

  username: string;
  password: string;
}

export interface LabCreateDto extends GroupCreateDto {
  professor: string;
  googleScholarUrl: string;
  numPostDoc: number;
  numPhd: number;
  numMaster: number;
  numUnderGraduate: number;
  roomNo: string;
  campus: CampusType;
}

export interface ClubCreateDto extends GroupCreateDto {
  numMembers: number;
  location: string;
}

export interface GroupUpdateDto {
  groupName: string;
  logoUrl: string;
  description: string;
  email: string;
  homepageUrl: string;
  representativeName: string;
  tags: string[];
}

export interface LabUpdateDto extends GroupUpdateDto {
  professor: string;
  googleScholarUrl: string;
  numPostDoc: number;
  numPhd: number;
  numMaster: number;
  numUnderGraduate: number;
  roomNo: string;
  campus: CampusType;
}

export interface ClubUpdateDto extends GroupUpdateDto {
  numMembers: number;
  location: string;
}
