"use client";

import { useCallback, useState } from "react";

interface UseEntitySearchParams<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: Partial<T>) => void;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
}: UseEntitySearchParams<T>) {
  const [searchValue, setSearchValue] = useState(params.search ?? "");

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      setParams({ search: value, page: 1 } as Partial<T>);
    },
    [setParams],
  );

  return { searchValue, onSearchChange };
}
