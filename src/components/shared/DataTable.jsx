import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "./EmptyState";

export default function DataTable({ columns, data, isLoading, emptyMessage }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/5 overflow-hidden glass-card">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              {columns.map((c, i) => (
                <TableHead key={i}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-white/5 hover:bg-white/5">
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-[80%] bg-white/10" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 overflow-hidden glass-card bg-card/40">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              {columns.map((c, i) => (
                <TableHead key={i}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <EmptyState message={emptyMessage || "No data found."} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden glass-card">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="hover:bg-transparent border-white/5">
            {columns.map((c, i) => (
              <TableHead key={i} className="font-semibold text-foreground">
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="border-white/5 hover:bg-white/5 transition-colors">
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
