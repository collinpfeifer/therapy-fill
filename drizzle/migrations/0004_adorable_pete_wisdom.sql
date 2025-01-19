PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text,
	`dateTime` text NOT NULL,
	`from` text NOT NULL,
	`status` text NOT NULL,
	`therapistId` text NOT NULL,
	`therapistName` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`therapistId`) REFERENCES `therapists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_appointments`("id", "clientId", "dateTime", "from", "status", "therapistId", "therapistName") SELECT "id", "clientId", "dateTime", "from", "status", "therapistId", "therapistName" FROM `appointments`;--> statement-breakpoint
DROP TABLE `appointments`;--> statement-breakpoint
ALTER TABLE `__new_appointments` RENAME TO `appointments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`appointmentId` text NOT NULL,
	`clientId` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`status` text NOT NULL,
	`bookingLink` text NOT NULL,
	FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "appointmentId", "clientId", "phoneNumber", "status", "bookingLink") SELECT "id", "appointmentId", "clientId", "phoneNumber", "status", "bookingLink" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;