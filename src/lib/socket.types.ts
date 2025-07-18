export interface JobEvent {
  type: "added" | "active" | "waiting" | "failed" | "completed";
  reason?: string;
  jobId?: string;
}

export interface JoinRoomResponse {
  type: "joined";
}

export interface PostData {
  content: string;
  journalId: string;
}

export interface JobProgress {
  status: JobEvent["type"] | "idle" | "joined";
  message: string;
  timestamp: string;
}
