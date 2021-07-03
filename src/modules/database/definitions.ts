export type NotionPageDto = {
  id: string;
  type: string;
  title: string;
  link: string;
  status: string;
  currentProgress: number;
  latestRelease: number;
  seenLatestRelease: boolean;
  releaseSchedule: string | null;
  latestReleaseUpdatedAt: string | null;
};
