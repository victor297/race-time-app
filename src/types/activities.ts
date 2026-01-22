export interface IActivityProps {
  id: string;
  avatarUrl: string;
  name: string;
  verb: string; // e.g. 'submitted', 'joined'
  distance?: string; // e.g. '5.9KM'
  event: string; // e.g. 'Tail Blazers virtual challenge (2025)'
  timeAgo: string; // e.g. 'just now', '3 mins ago'
}
