CREATE TABLE `youtube_analytics_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricKey` varchar(100) NOT NULL,
	`metricValue` text NOT NULL,
	`cachedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `youtube_analytics_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `youtube_analytics_cache_metricKey_unique` UNIQUE(`metricKey`)
);
--> statement-breakpoint
CREATE TABLE `youtube_oauth_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`scope` text,
	`tokenType` varchar(50) DEFAULT 'Bearer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtube_oauth_tokens_id` PRIMARY KEY(`id`)
);
