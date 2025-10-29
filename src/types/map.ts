export type AlertType = 'outage' | 'maintenance' | 'construction' | 'incident' | 'scheduled' | 'emergency' | 'alert' | 'cleaning' | 'protection';

export interface AlertDetails {
  progress?: number;
  endDate?: string;
  address?: string;
  team?: string;
  investment?: string;
  duration?: string;
  responsible?: string;
  sectors?: string;
}

export interface AlertMarker {
  location: string;
  message: string;
  time: string;
  type: AlertType;
  position: [number, number];
  details?: AlertDetails;
}

export interface MapMarker {
  position: [number, number];
  type?: AlertType;
  popup: string;
}
