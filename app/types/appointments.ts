export interface Appointment {
  _id: string;
  date: string;
  time: string;
  reason: string;
  type: string;
  status: string;
  notes?: string;
  duration?: number;
  patient_id?: any;
}

export interface AppointmentsResponse {
  future: Appointment[];
  past: Appointment[];
}