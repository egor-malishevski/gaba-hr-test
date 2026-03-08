export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  email: string;
  phone: string;
  image: string;
  company?: {
    name: string;
    title: string;
  };
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};
