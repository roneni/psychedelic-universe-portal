ALTER TABLE `mixes` MODIFY COLUMN `category` enum('progressive-psy','psychedelic-trance','goa-trance','full-on') NOT NULL;--> statement-breakpoint
ALTER TABLE `mixes` ADD `artist` varchar(255);