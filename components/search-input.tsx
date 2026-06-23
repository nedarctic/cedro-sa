"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

function useDebounce(value: string, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default function SearchInput({placeholder}: {placeholder: string}) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(
        searchParams.get("search") ?? ""
    );

    const debouncedSearch = useDebounce(value, 400);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearch) {
            params.set("search", debouncedSearch);
            params.set("page", "1");
        } else {
            params.delete("search");
        }

        router.push(`?${params.toString()}`);
    }, [debouncedSearch]);

    return (
        <InputGroup>
            <InputGroupInput
                aria-label="Search"
                placeholder={placeholder}
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
        </InputGroup>
    );
}