export interface INewsItem {
  by: string;
  descendants: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export interface ICommentsItem {
  by: string;
  id: number;
  kids?: number[];
  parent: number;
  text: string;
  time: number;
  type: string;
  deleted: boolean;
  dead: boolean;
}
