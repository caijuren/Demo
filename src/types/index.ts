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

export interface LogEntry {
  timestamp: string;
  source: string;
  process: string;
  message: string;
  raw: string;
}

export interface EmployeeProfile {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  tenure: string;
  manager: string;
  workHours: string;
}

export interface HistoricalBehavior {
  period: string;
  normalAccessTimes: string;
  abnormalLoginCount: number;
  dataExportHistory: string;
  firstAlert: boolean;
}

export interface AccessSource {
  ip: string;
  device: string;
  isVpn: boolean;
  tool: string;
}

export interface ApprovalProcess {
  submitTime: string;
  approver: string;
  purpose: string;
  archiveTime: string;
  reason: string;
}

export interface DataDetails {
  recordCount: number;
  dataSize: string;
  sensitiveFields: string[];
}

export interface AlertItem {
  id: string;
  name: string;
  category: AlertCategory;
  level: 'critical' | 'warning' | 'info';
  time: string;
  status: 'pending' | 'processing' | 'resolved';
  detail: string;
  source: string;
  eventDescription?: string;
  comprehensiveAssessment?: string;
  handlingMeasures?: string[];
  employeeProfile?: EmployeeProfile;
  historicalBehavior?: HistoricalBehavior;
  accessSource?: AccessSource;
  approvalProcess?: ApprovalProcess;
  dataDetails?: DataDetails;
  terminalLogs?: LogEntry[];
}
