export type NotionPageDto = {
  type: string;
  title: string;
  link: string;
  status: string;
  currentProgress: number;
  latestRelease: number;
  seenLatestRelease: boolean;
  releaseSchedule: Array<string>,
};
