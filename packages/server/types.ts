export type Message = {
	type: "message" | "init" | "pull-progress";
	data: any;
};