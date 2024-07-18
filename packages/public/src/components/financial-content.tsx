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
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthContext';

const fetchFinancialData = (token: string | null) => async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/financial`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalIncome = (token: string | null) => async () => {
  const response = await fetch(
    `${API_PROTOCOL}://${API_HOST}/api/financial/income`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalExpense = (token: string | null) => async () => {
  const response = await fetch(
    `${API_PROTOCOL}://${API_HOST}/api/financial/expense`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchBalance = (token: string | null) => async () => {
  const response = await fetch(
    `${API_PROTOCOL}://${API_HOST}/api/financial/balance`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function FinancialContent() {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const { data: financialData } = useQuery({
    queryKey: ["financial"],
    queryFn: fetchFinancialData(token),
  });
  const { data: totalIncome } = useQuery({
    queryKey: ["totalIncome"],
    queryFn: fetchTotalIncome(token),
  });
  const { data: totalExpense } = useQuery({
    queryKey: ["totalExpense"],
    queryFn: fetchTotalExpense(token),
  });
  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance(token),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalIncome")}
            </CardTitle>
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome?.totalIncome || 0, i18n.language)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalExpenses")}
            </CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpense?.totalExpense || 0, i18n.language)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("balance")}
            </CardTitle>
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance?.balance || 0, i18n.language)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t("recentTransactions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("paymentMethod")}</TableHead>
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
                      {formatCurrency(transaction.amount, i18n.language)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transaction.direction === "in"
                          ? t("income")
                          : t("expense")}
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
