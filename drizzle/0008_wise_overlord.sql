CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mixId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `karma_points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` enum('signup','favorite','unfavorite','suggestion','newsletter','daily_visit','share','artist_submit') NOT NULL,
	`points` int NOT NULL,
	`description` varchar(255),
	`referenceId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `karma_points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ronens_picks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`youtubeId` varchar(20) NOT NULL,
	`description` text,
	`thumbnailUrl` varchar(500),
	`contentType` enum('mix','track') NOT NULL DEFAULT 'mix',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ronens_picks_id` PRIMARY KEY(`id`)
);
