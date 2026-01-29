import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchParams<
    T extends {
        search: string;
        page: number;
    },
> {
    params: T;
    setParams: (params: T) => void;
    debounceMs?: number;
}

export function useEntitySearch<
    T extends {
        search: string;
        page: number;
    },
>({
    params,
    setParams,
    debounceMs = 500,
}: UseEntitySearchParams<T>) {
    const [localSearch, setLocalSearch] = useState(String((params as any).search ?? ""));

    useEffect(() => {
        const paramsSearch = String((params as any).search ?? "");

        const timer = setTimeout(() => {
            if (localSearch !== paramsSearch) {
                setParams({
                    ...params,
                    search: localSearch,
                    page: PAGINATION.DEFAULT_PAGE,
                });
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, params, setParams, debounceMs]);

    useEffect(() => {
        setLocalSearch(String((params as any).search ?? ""));
    }, [params.search]);

        return {
            searchValue: localSearch,
            onSearchChange: setLocalSearch,
        };

}