export interface Complaint {
  id: string;
  name?: string;
  rollNumber?: string;
  issueType: string;
  subject: string;
  description: string;
  dateSubmitted: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  profileImage?: string;
}

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
}