export type CareerProfile = {
  id?: string;
  accountId: string;
  title: string;
  curriculumPath: string;
  curriculumText: string;
  curriculumScore: number;
  curriculumAnalyse: string;
  updatedAt?: string;
};

export type CareerProfileCreate = {
  curriculumPath: string;
};

export type CareerProfileUpdate = {
  title: string;
};
