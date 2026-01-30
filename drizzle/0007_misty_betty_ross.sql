CREATE TABLE `suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT 'Anonymous',
	`email` varchar(320),
	`category` enum('feature','improvement','content','other') NOT NULL DEFAULT 'feature',
	`suggestion` text NOT NULL,
	`status` enum('pending','reviewed','implemented','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suggestions_id` PRIMARY KEY(`id`)
);
