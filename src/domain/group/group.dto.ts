import { UserCreateDto } from './user.dto'; // Import the missing UserCreateDto interface
//enum campus type (자과캠 / 인사캠)
enum CampusType {
    NC = "자과캠",
    IC = "인사캠"
}

export interface GroupCreateDto {
    groupName: string;
    logoUrl: string;
    description: string;
    email: string;
    homepageUrl: string;
    tags: string[];
    
    username: string;
    password: string;
}

export interface LabCreateDto extends GroupCreateDto {
    professor: string;
    numPostDoc: number;
    numPhd: number;
    numMaster: number;
    numUnderGraduate: number;
    roomNo: string;
    campus: CampusType;
}

export interface ClubCreateDto extends GroupCreateDto {
    location: string;
}

export interface GroupUpdateDto {
    groupName: string;
    logoUrl: string;
    description: string;
    email: string;
    homepageUrl: string;
    tags: string[];
}

export interface LabUpdateDto extends GroupUpdateDto {
    professor: string;
    numPostDoc: number;
    numPhd: number;
    numMaster: number;
    numUnderGraduate: number;
    roomNo: string;
    campus: CampusType;
}