export interface GeneratedSentence {
  id: string;
  topicId: string;
  source: string;
  translated: string;
  topicName: string;
  level: string;
  createdAt: number;
}

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
