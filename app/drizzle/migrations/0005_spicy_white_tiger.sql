PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`cancellationListId` text NOT NULL,
	`therapistId` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`textConsent` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`cancellationListId`) REFERENCES `cancellationLists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`therapistId`) REFERENCES `therapists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "cancellationListId", "therapistId", "name", "email", "phoneNumber", "textConsent") SELECT "id", "cancellationListId", "therapistId", "name", "email", "phoneNumber", "textConsent" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `clients_email_unique` ON `clients` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `clients_phoneNumber_unique` ON `clients` (`phoneNumber`);--> statement-breakpoint
CREATE TABLE `__new_therapists` (
	`id` text PRIMARY KEY NOT NULL,
	`cancellationListId` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`textConsent` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`cancellationListId`) REFERENCES `cancellationLists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_therapists`("id", "cancellationListId", "name", "email", "password", "textConsent") SELECT "id", "cancellationListId", "name", "email", "password", "textConsent" FROM `therapists`;--> statement-breakpoint
DROP TABLE `therapists`;--> statement-breakpoint
ALTER TABLE `__new_therapists` RENAME TO `therapists`;--> statement-breakpoint
CREATE UNIQUE INDEX `therapists_cancellationListId_unique` ON `therapists` (`cancellationListId`);--> statement-breakpoint
CREATE UNIQUE INDEX `therapists_email_unique` ON `therapists` (`email`);