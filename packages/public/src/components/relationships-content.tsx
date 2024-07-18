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
import { UsersIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";
import { useTranslation } from "react-i18next";

const fetchRelationshipsData = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/relationships`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalInteractions = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/relationships/total-interactions`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchMostFrequentPerson = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/relationships/most-frequent-person`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function RelationshipsContent() {
  const { t } = useTranslation();
  const { data: relationshipsData } = useQuery({
    queryKey: ["relationships"],
    queryFn: fetchRelationshipsData,
  });
  const { data: totalInteractions } = useQuery({
    queryKey: ["totalInteractions"],
    queryFn: fetchTotalInteractions,
  });
  const { data: mostFrequentPerson } = useQuery({
    queryKey: ["mostFrequentPerson"],
    queryFn: fetchMostFrequentPerson,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalInteractions")}</CardTitle>
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInteractions?.total || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("mostFrequentPerson")}
            </CardTitle>
            <HeartIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostFrequentPerson?.person || 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("latestInteraction")}</CardTitle>
            <MessageCircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relationshipsData?.[0]?.interaction_type || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t("recentRelationshipEntries")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("person")}</TableHead>
                  <TableHead>{t("interactionType")}</TableHead>
                  <TableHead>{t("feelings")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relationshipsData?.slice(0, 5).map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.person}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {entry.interaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.feelings}</TableCell>
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
