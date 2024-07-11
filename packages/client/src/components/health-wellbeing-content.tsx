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
import { ActivityIcon, HeartPulseIcon, BrainIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";
import { useTranslation } from "react-i18next";

const fetchHealthData = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/health-wellbeing`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalExerciseTime = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/health-wellbeing/exercise-time`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchAverageEmotionIntensity = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/health-wellbeing/emotion-intensity`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function HealthWellbeingContent() {
  const { t } = useTranslation();
  const { data: healthData } = useQuery({
    queryKey: ["health-wellbeing"],
    queryFn: fetchHealthData,
  });
  const { data: totalExerciseTime } = useQuery({
    queryKey: ["totalExerciseTime"],
    queryFn: fetchTotalExerciseTime,
  });
  const { data: averageEmotionIntensity } = useQuery({
    queryKey: ["averageEmotionIntensity"],
    queryFn: fetchAverageEmotionIntensity,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalExerciseTime")}</CardTitle>
            <ActivityIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("hoursValue", { value: totalExerciseTime?.totalHours || 0 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("averageEmotionIntensity")}
            </CardTitle>
            <HeartPulseIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("intensityValue", { value: averageEmotionIntensity?.average || 0 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("latestMood")}</CardTitle>
            <BrainIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData?.[0]?.emotion_description || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t("recentHealthEntries")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("activity")}</TableHead>
                  <TableHead>{t("duration")}</TableHead>
                  <TableHead>{t("intensity")}</TableHead>
                  <TableHead>{t("emotion")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthData?.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.activity_type}</TableCell>
                    <TableCell>{entry.duration?.minutes}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {entry.intensity}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.emotion_description}</TableCell>
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
