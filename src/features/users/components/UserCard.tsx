import type { User } from "../model/types";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <article className="card">
      <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
      <div className="card-body">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <a href={`mailto:${user.email}`}>{user.email}</a>
        <p>{user.phone}</p>
        <p>{user.company?.name ?? "Без компании"}</p>
      </div>
    </article>
  );
};

export { UserCard };
