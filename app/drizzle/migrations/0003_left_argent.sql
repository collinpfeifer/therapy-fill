ALTER TABLE `auditLogs` RENAME COLUMN "event_timestamp" TO "eventTime";--> statement-breakpoint
ALTER TABLE `auditLogs` RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE `auditLogs` RENAME COLUMN "source_ip" TO "sourceIp";