import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface GeneralEntry {
  id: number;
  entry_date: string;
  category: string;
  description: string;
}

async function getGeneralEntries(): Promise<GeneralEntry[]> {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/general`);
  if (!response.ok) {
    throw new Error("Failed to fetch general entries");
  }
  return response.json();
}

export function GeneralContent() {
  const { t } = useTranslation();
  const {
    data: entries = [],
    isLoading,
    isError,
  } = useQuery<GeneralEntry[]>({
    queryKey: ["generalEntries"],
    queryFn: getGeneralEntries,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center"
      style={{
        height: "calc(100vh - 260px)",
      }}
      >
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching general entries</div>;
  }

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDate(entry.entry_date)}
              </div>
              <div className={`category ${entry.category.replace(/\s/g, "-")}`}>
                {t(entry.category)}
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {entry.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
