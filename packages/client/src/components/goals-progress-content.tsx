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
import { TargetIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";

const fetchGoalsProgressData = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/goals-progress`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalGoals = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/goals-progress/total-goals`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchCompletedGoals = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/goals-progress/completed-goals`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function GoalsProgressContent() {
  const { data: goalsProgressData } = useQuery({
    queryKey: ["goals-progress"],
    queryFn: fetchGoalsProgressData,
  });
  const { data: totalGoals } = useQuery({
    queryKey: ["totalGoals"],
    queryFn: fetchTotalGoals,
  });
  const { data: completedGoals } = useQuery({
    queryKey: ["completedGoals"],
    queryFn: fetchCompletedGoals,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <TargetIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalGoals?.total || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Goals
            </CardTitle>
            <CheckCircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedGoals?.completed || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress Goals</CardTitle>
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalGoals?.total || 0) - (completedGoals?.completed || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Goals & Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Goal Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goalsProgressData?.slice(0, 5).map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.goal_start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {entry.goal_end_date ? new Date(entry.goal_end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{entry.goal_description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.progress}</TableCell>
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
