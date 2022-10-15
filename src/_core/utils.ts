import {transform} from "ol/proj";
import {Location} from "../_domain/region.service";
import {Coordinate} from "ol/coordinate";

export function toXZ({lat, lon}: Location): Coordinate {
  return transform([lon, lat], "EPSG:4326", "EPSG:3857");
}
