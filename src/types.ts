export interface MilestoneEvent {
  action: 'closed' | 'opened' | 'edited' | 'created';
  milestone: {
    closed_at: string;
    closed_issues: number;
    created_at: string;
    description: string;
    number: number;
    open_issues: number;
    title: string;
    updated_at: string;
  };
}
