export type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Main: {userId: string};
  Home: {userId: string};
  Tasks: {userId: string};
  UpdateTask: {task: object; userId: string};
  NewTask: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};
