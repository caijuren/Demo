export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
}

export type AlertCategory = 'phishing' | 'internet-behavior' | 'abnormal-login';

export interface AlertItem {
  id: string;
  name: string;
  category: AlertCategory;
  level: 'critical' | 'warning' | 'info';
  time: string;
  status: 'pending' | 'processing' | 'resolved';
  detail: string;
}