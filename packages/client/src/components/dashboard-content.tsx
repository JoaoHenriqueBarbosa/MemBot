import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSignIcon, WalletIcon } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-06-01</TableCell>
                  <TableCell>Acme Inc. - Monthly Subscription</TableCell>
                  <TableCell className="text-right">$99.99</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Expense</Badge>
                  </TableCell>
                  <TableCell>
                    Credit card
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-05</TableCell>
                  <TableCell>Customer A - Order #12345</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Income</Badge>
                  </TableCell>
                  <TableCell>
                    Credit card
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-10</TableCell>
                  <TableCell>Rent - Office Space</TableCell>
                  <TableCell className="text-right">$1,500.00</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Expense</Badge>
                  </TableCell>
                  <TableCell>
                    Credit card
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-15</TableCell>
                  <TableCell>Customer B - Order #54321</TableCell>
                  <TableCell className="text-right">$175.00</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Income</Badge>
                  </TableCell>
                  <TableCell>
                    Credit card
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-20</TableCell>
                  <TableCell>Utilities - Electricity</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Expense</Badge>
                  </TableCell>
                  <TableCell>
                    Credit card
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
