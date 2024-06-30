import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSignIcon, WalletIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";

const fetchFinancialData = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/financial`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalIncome = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/financial/income`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalExpense = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/financial/expense`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchBalance = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/financial/balance`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function FinancialContent() {
  const { data: financialData } = useQuery({
    queryKey: ["financial"],
    queryFn: fetchFinancialData,
  });
  const { data: totalIncome } = useQuery({
    queryKey: ["totalIncome"],
    queryFn: fetchTotalIncome,
  });
  const { data: totalExpense } = useQuery({
    queryKey: ["totalExpense"],
    queryFn: fetchTotalExpense,
  });
  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome?.totalIncome || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpense?.totalExpense || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance?.balance || 0)}
            </div>
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
                {financialData?.slice(0, 5).map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.entry_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transaction.direction === "in" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
