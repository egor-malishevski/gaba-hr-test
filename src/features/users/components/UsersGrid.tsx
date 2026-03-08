import type { User } from "../model/types";
import { UserCard } from "./UserCard";

type UsersGridProps = {
  users: User[];
};

const UsersGrid = ({ users }: UsersGridProps) => {
  return (
    <div className="grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export { UsersGrid };
