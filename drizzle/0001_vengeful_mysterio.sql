CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`eventData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
