export type NotionPageDto = {
  id: string;
  type: string;
  title: string;
  link: string;
  status: Array<string>;
  currentProgress: number;
  latestRelease: number;
  seenLatestRelease: boolean;
  releaseSchedule: string | null;
  latestReleaseUpdatedAt: string | null;
  rating: number | null;
};

// eslint-disable-next-line no-shadow
export enum EPageStatus {
  COMPLETED = "Completed",
  DROPPED = "Dropped",
  PLANNING_TO_READ = "Planning To Read",
  PLANNING_TO_WATCH = "Planning To Watch",
  READING = "Reading",
  WATCHING = "Watching",
  ON_HOLD = "On Hold",
  DONE_AIRING = "Done Airing"
}
