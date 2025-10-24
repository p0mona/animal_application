import type { PatientData } from "~/types/patientData";

export interface Appointment {
  _id: string;
  date: string;
  time: string;
  reason: string;
  type: string;
  status: string;
  notes?: string;
  duration?: number;
  patient_id?: string | PatientData;
  symptoms?: string;
  exam?: string;
  diagnosis?: string;
  treatment?: string;
  advice?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentsResponse {
  future: Appointment[];
  past: Appointment[];
}
