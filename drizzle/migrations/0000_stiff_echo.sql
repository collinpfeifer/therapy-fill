CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text,
	`dateTime` text NOT NULL,
	`from` text NOT NULL,
	`therapistId` text,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`therapistId`) REFERENCES `therapists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cancellationLists` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`cancellationListId` text,
	`therapistId` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`textConsent` integer DEFAULT false,
	FOREIGN KEY (`cancellationListId`) REFERENCES `cancellationLists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`therapistId`) REFERENCES `therapists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_email_unique` ON `clients` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `clients_phoneNumber_unique` ON `clients` (`phoneNumber`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`appointmentId` text,
	`clientId` text,
	`bookingLink` text NOT NULL,
	FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `therapists` (
	`id` text PRIMARY KEY NOT NULL,
	`cancellationListId` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`textConsent` integer DEFAULT false,
	FOREIGN KEY (`cancellationListId`) REFERENCES `cancellationLists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `therapists_cancellationListId_unique` ON `therapists` (`cancellationListId`);--> statement-breakpoint
CREATE UNIQUE INDEX `therapists_email_unique` ON `therapists` (`email`);