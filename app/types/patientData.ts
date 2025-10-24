import type { OwnerData } from "~/types/ownerData";

export interface PatientData {
  _id: string;
  name?: string;
  breed?: string;
  image?: string;
  sex?: string;
  animal?: string;
  animal_age?: string;
  animal_height?: string;
  animal_weight?: string;
  chip?: string;
  owner?: OwnerData;
}
