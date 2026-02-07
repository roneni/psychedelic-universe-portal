CREATE TABLE `vault_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vault_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vault_mixes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`youtubeId` varchar(20) NOT NULL,
	`description` text,
	`duration` varchar(20),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vault_mixes_id` PRIMARY KEY(`id`)
);
