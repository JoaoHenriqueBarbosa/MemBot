export type Message = {
	type: "message" | "init" | "pull-progress";
	id?: string;
	role?: "user" | "robot";
	done?: boolean;
	data: any;
};