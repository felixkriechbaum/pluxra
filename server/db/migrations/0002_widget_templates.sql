CREATE TABLE `widget_templates` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT 'puzzle',
	`color` varchar(20) NOT NULL DEFAULT '#6366f1',
	`config` json NOT NULL,
	CONSTRAINT `widget_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `widget_templates_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
