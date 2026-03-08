import type { FormEvent } from "react";

type SearchFormProps = {
  value: string;
  canReset: boolean;
  onValueChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

const SearchForm = ({
  value,
  canReset,
  onValueChange,
  onSubmit,
  onReset
}: SearchFormProps) => {
  return (
    <form className="search" onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="Поиск по имени..."
        aria-label="Поиск по имени"
      />
      <button type="submit">Найти</button>
      <button
        type="button"
        className="ghost"
        onClick={onReset}
        disabled={!canReset}
      >
        Сбросить
      </button>
    </form>
  );
};

export { SearchForm };
