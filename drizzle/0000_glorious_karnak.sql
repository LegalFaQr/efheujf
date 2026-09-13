CREATE TABLE `admissions` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_name` text NOT NULL,
	`child_first_name` text NOT NULL,
	`child_age` text NOT NULL,
	`programme` text NOT NULL,
	`contact_number` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_admissions_contact_created` ON `admissions` (`contact_number`,`created_at`);