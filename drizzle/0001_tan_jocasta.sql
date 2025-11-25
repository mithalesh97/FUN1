CREATE TABLE `slang_terms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`term` varchar(100) NOT NULL,
	`meaning` text NOT NULL,
	`pronunciation` varchar(255) NOT NULL,
	`example` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slang_terms_id` PRIMARY KEY(`id`),
	CONSTRAINT `slang_terms_term_unique` UNIQUE(`term`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`slangTermId` int NOT NULL,
	`quizType` enum('pronunciation','meaning') NOT NULL,
	`isCorrect` int NOT NULL DEFAULT 0,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalQuizzes` int NOT NULL DEFAULT 0,
	`correctAnswers` int NOT NULL DEFAULT 0,
	`pronunciationScore` int NOT NULL DEFAULT 0,
	`meaningScore` int NOT NULL DEFAULT 0,
	`streakCount` int NOT NULL DEFAULT 0,
	`lastQuizDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_stats_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_slangTermId_slang_terms_id_fk` FOREIGN KEY (`slangTermId`) REFERENCES `slang_terms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_stats` ADD CONSTRAINT `user_stats_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;