import type { PetData } from '~/types/petData'

export interface OwnerData {
  name?: string;
  birthday?: string;
  sex?: string;
  phone?: string;
  image?: string | File | null;
  pet?: PetData;
  sos_phone?: string;
}

export interface OwnerFormData extends OwnerData {
  pet: PetData;
}