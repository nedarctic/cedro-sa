'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

export function TableData({ headers, data, caption, path }: { headers: { label: string, key: string }[], data: any, caption?: string; path?: string }) {
    const router = useRouter();
    return (
        <Table>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
                <TableRow>
                    {headers.map((header, index) => (
                        <TableHead key={header.key} className={`w-25 ${index === headers.length - 1 ? 'text-right' : ''}`}>{header.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row: any, rowIndex: number) => (
                    <TableRow key={rowIndex} onClick={() => path && router.push(`${path}/${row.id}`)} className={path ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}>
                        {headers.map((header, headerIndex) => (
                            <TableCell key={headerIndex} className={`w-25 ${headerIndex === headers.length - 1 ? 'text-right' : ''}`}>
                                {row[header.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}