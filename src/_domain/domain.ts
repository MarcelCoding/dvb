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

export interface WebsocketEvent {
  time: string,
  station: string,
  region: number,
  telegram_type: number,
  reporting_point: number,
  junction: number,
  direction: number,
  request_status: number,
  delay: number,
  priority: number,
  direction_request: number,
  line: number,
  run_number: number,
  destination_number: number,
  train_length: number,
}
