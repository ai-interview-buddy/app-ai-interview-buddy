export interface JobPosition {
  id: string;
  accountId: string;
  careerProfileId?: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  jobUrl?: string;
  jobTitle: string;
  jobDescription: string;
  salaryRange?: string;
  expectedSalary?: string;
  offerReceived: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type JobPositionCreateByUrl = {
  profileId?: string;
  jobUrl: string;
};

export type JobPositionCreateByDescription = {
  profileId?: string;
  jobDescription: string;
};

export interface JobPositionUpdate {
  careerProfileId: string;
  companyName: string;
  companyWebsite?: string;
  jobUrl?: string;
  jobTitle: string;
  expectedSalary?: string;
}
