import { CreditCard } from "lucide-react"
import { requireUser } from "@/lib/portal"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  confirmed: "default",
  pending: "outline",
  failed: "secondary",
}

function ksh(n: number) {
  return `KSh ${n.toLocaleString()}`
}

export default async function PaymentsPage() {
  const { supabase, user } = await requireUser("/portal/payments")
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const list = payments ?? []
  const totalPaid = list
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + (p.amount_ksh ?? 0), 0)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your payment history. Pay via M-Pesa or bank transfer; records are confirmed by AMTMTI staff.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-medium text-muted-foreground">Total confirmed</p>
        <p className="mt-1 text-3xl font-semibold text-foreground">{ksh(totalPaid)}</p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <CreditCard className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No payment records yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{p.program_slug ?? "—"}</TableCell>
                  <TableCell className="capitalize">{p.method.replace("_", " ")}</TableCell>
                  <TableCell className="font-mono text-xs">{p.reference ?? "—"}</TableCell>
                  <TableCell className="text-right">{ksh(p.amount_ksh)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status] ?? "outline"} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
