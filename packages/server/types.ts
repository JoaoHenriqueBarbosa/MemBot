export type Message = {
	type: "message" | "init" | "pull-progress";
	id?: string;
	role?: "user" | "robot" | "assistant";
	done?: boolean;
	data?: any;
	content?: string;
};
