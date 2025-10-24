import type { OwnerData } from "./ownerData";

export interface ProfileData {
  name?: string;
  birthday?: string;
  sex?: string;
  image?: string | null;
  phone?: string;
  owner?: OwnerData;
  [key: string]: any;
}
