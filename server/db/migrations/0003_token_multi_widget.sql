CREATE TABLE `ingest_token_widgets` (
	`token_id` varchar(36) NOT NULL,
	`widget_id` varchar(36) NOT NULL,
	CONSTRAINT `ingest_token_widgets_pk` PRIMARY KEY(`token_id`, `widget_id`),
	CONSTRAINT `ingest_token_widgets_token_fk` FOREIGN KEY (`token_id`) REFERENCES `ingest_tokens`(`id`) ON DELETE CASCADE,
	CONSTRAINT `ingest_token_widgets_widget_fk` FOREIGN KEY (`widget_id`) REFERENCES `widgets`(`id`) ON DELETE CASCADE
);--> statement-breakpoint
INSERT INTO `ingest_token_widgets` (`token_id`, `widget_id`)
SELECT `id`, `widget_id` FROM `ingest_tokens` WHERE `widget_id` IS NOT NULL;
