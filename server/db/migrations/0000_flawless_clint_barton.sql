CREATE TABLE `ingest_data` (
	`id` varchar(36) NOT NULL,
	`widget_id` varchar(36) NOT NULL,
	`token_id` varchar(36) NOT NULL,
	`payload` json NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `ingest_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingest_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`widget_id` varchar(36) NOT NULL,
	`token_hash` varchar(255) NOT NULL,
	`label` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`last_used_at` datetime,
	CONSTRAINT `ingest_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tabs` (
	`id` varchar(36) NOT NULL,
	`page_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `tabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `widgets` (
	`id` varchar(36) NOT NULL,
	`tab_id` varchar(36) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`plugin_id` varchar(100) NOT NULL,
	`col_start` int NOT NULL DEFAULT 1,
	`col_span` int NOT NULL DEFAULT 3,
	`row_start` int NOT NULL DEFAULT 1,
	`row_span` int NOT NULL DEFAULT 3,
	`config` json NOT NULL DEFAULT ('{}'),
	CONSTRAINT `widgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ingest_data` ADD CONSTRAINT `ingest_data_widget_id_widgets_id_fk` FOREIGN KEY (`widget_id`) REFERENCES `widgets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ingest_data` ADD CONSTRAINT `ingest_data_token_id_ingest_tokens_id_fk` FOREIGN KEY (`token_id`) REFERENCES `ingest_tokens`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ingest_tokens` ADD CONSTRAINT `ingest_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ingest_tokens` ADD CONSTRAINT `ingest_tokens_widget_id_widgets_id_fk` FOREIGN KEY (`widget_id`) REFERENCES `widgets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tabs` ADD CONSTRAINT `tabs_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `widgets` ADD CONSTRAINT `widgets_tab_id_tabs_id_fk` FOREIGN KEY (`tab_id`) REFERENCES `tabs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `widgets` ADD CONSTRAINT `widgets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;