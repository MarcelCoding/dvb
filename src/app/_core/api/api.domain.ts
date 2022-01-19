export interface Port {
  id: string;
  city: string;
  name: string;
}

export interface Departure {
  id: string;
  line: string;
  direction: string;
  platform: string | null;
  mot: string;
  time: Date | null;
  scheduled: Date;
  onTime: boolean;
}

