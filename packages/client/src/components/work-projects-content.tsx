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
import { BriefcaseIcon, ClipboardListIcon, AlertCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_HOST, API_PROTOCOL } from "@/lib/consts";

const fetchWorkProjectsData = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/work-projects`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchTotalTasks = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/work-projects/total-tasks`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchCompletedTasks = async () => {
  const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/work-projects/completed-tasks`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function WorkProjectsContent() {
  const { data: workProjectsData } = useQuery({
    queryKey: ["work-projects"],
    queryFn: fetchWorkProjectsData,
  });
  const { data: totalTasks } = useQuery({
    queryKey: ["totalTasks"],
    queryFn: fetchTotalTasks,
  });
  const { data: completedTasks } = useQuery({
    queryKey: ["completedTasks"],
    queryFn: fetchCompletedTasks,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BriefcaseIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks?.total || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <ClipboardListIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks?.completed || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalTasks?.total || 0) - (completedTasks?.completed || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Work/Projects Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workProjectsData?.slice(0, 5).map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.task_description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {entry.task_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.priority}</TableCell>
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
