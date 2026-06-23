"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function getPaginationRange(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const left = current - delta;
  const right = current + delta;

  let last = 0;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (last && i - last > 1) range.push("...");
      range.push(i);
      last = i;
    }
  }

  return range;
}

export function PaginationComponent({
  meta,
}: {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = meta.page;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  const pages = getPaginationRange(currentPage, meta.totalPages);

  return (
    <Pagination>
      <PaginationContent>

        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goTo(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Pages */}
        {pages.map((p, idx) => (
          <PaginationItem key={idx}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={p === currentPage}
                onClick={() => goTo(p)}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => goTo(currentPage + 1)}
            className={
              currentPage >= meta.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}