export type Regions = Record<string, Region>;
export type Region = Record<string, Junction[]>;

export interface Junction {
  lat: number,
  lon: number,
  direction: number,
  request_status: number,
}

export type Network = Record<string, Line>;
export type Line = Record<string, Run>;

export interface Run {
  junction: number,
  line: number,
  run_number: number,
  time_stamp: number,
  delayed: number,
  direction: number,
  request_status: number,
}
