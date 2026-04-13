export interface Incident {
  incidentNumber: string;
  summary: string;
  detailedDescription: string;
  createdOn: string;
  assignedTo: string;
}

export interface IncidentGroup {
  primaryIncident: Incident;
  duplicates: Incident[];
  similarIncidents: Incident[];
}

export interface ChartDataItem {
  name: string;
  duplicates: number;
  similar: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  role: string;
}

export interface LoginData {
  admin: {
    username: string;
    password: string;
    role: string;
  };
  users: {
    username: string;
    password: string;
    role: string;
  }[];
}

export interface SessionData {
  username: string;
  role: string;
  expiresAt: number;
}
