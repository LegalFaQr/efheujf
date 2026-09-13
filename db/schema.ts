import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const admissions = sqliteTable('admissions', {
  id: text('id').primaryKey(),
  parentName: text('parent_name').notNull(),
  childFirstName: text('child_first_name').notNull(),
  childAge: text('child_age').notNull(),
  programme: text('programme').notNull(),
  contactNumber: text('contact_number').notNull(),
  message: text('message').notNull().default(''),
  consentAt: text('consent_at').notNull(),
  createdAt: text('created_at').notNull(),
  status: text('status').notNull().default('new'),
}, table => [index('idx_admissions_contact_created').on(table.contactNumber, table.createdAt)]);
