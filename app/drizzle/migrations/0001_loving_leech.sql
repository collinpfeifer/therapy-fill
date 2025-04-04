CREATE TABLE `auditLogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_timestamp` text DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`details` text NOT NULL,
	`source_ip` text NOT NULL,
	`hash` text NOT NULL
);
