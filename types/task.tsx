export interface Task {
  id: string;
  name: string;
  category: string;
  createdTime: number;
  description: string;
  deadline: number;
  completed: boolean;
  userId: string;
}
