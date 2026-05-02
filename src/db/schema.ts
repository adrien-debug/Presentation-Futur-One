import {
  pgTable, text, timestamp, boolean, integer, jsonb, primaryKey, unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── NextAuth.js v5 required tables ──────────────────────────────────────────

export const users = pgTable("users", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text("name"),
  email:         text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image:         text("image"),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:              text("type").$type<AdapterAccountType>().notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token:     text("refresh_token"),
  access_token:      text("access_token"),
  expires_at:        integer("expires_at"),
  token_type:        text("token_type"),
  scope:             text("scope"),
  id_token:          text("id_token"),
  session_state:     text("session_state"),
}, (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires:      timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires", { mode: "date" }).notNull(),
}, (t) => [primaryKey({ columns: [t.identifier, t.token] })]);

// ─── App tables ───────────────────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name:           text("name").notNull().default("Mon projet"),
  activeThemeId:  text("active_theme_id").notNull().default("futuristic-infra"),
  colorOverrides: jsonb("color_overrides").notNull().default({}),
  showGrid:       boolean("show_grid").notNull().default(true),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  updatedAt:      timestamp("updated_at").defaultNow().notNull(),
  lastOpenedAt:   timestamp("last_opened_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id:              text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId:       text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  orderIndex:      integer("order_index").notNull().default(0),
  name:            text("name").notNull().default("Page 1"),
  hideHeader:      boolean("hide_header").notNull().default(false),
  hideFooter:      boolean("hide_footer").notNull().default(false),
  zones:           jsonb("zones").notNull().default([]),
  contentStore:    jsonb("content_store").notNull().default({}),
  layoutOverrides: jsonb("layout_overrides").notNull().default({}),
  boxStyles:       jsonb("box_styles").notNull().default({}),
  images:          jsonb("images").notNull().default({}),
  chartConfigs:    jsonb("chart_configs").notNull().default({}),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
});

export const assets = pgTable("assets", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId:  text("project_id").references(() => projects.id, { onDelete: "set null" }),
  storageKey: text("storage_key"),          // R2 path — null until Phase 3
  src:        text("src"),                  // base64 or public URL for Phase 1
  mimeType:   text("mime_type"),
  sizeBytes:  integer("size_bytes"),
  sha256:     text("sha256"),               // dedup key
  createdAt:  timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.userId, t.sha256)]);

// ─── Types ─────────────────────────────────────────────────────────────────────

export type User    = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Page    = typeof pages.$inferSelect;
export type Asset   = typeof assets.$inferSelect;

export type NewProject = typeof projects.$inferInsert;
export type NewPage    = typeof pages.$inferInsert;
export type NewAsset   = typeof assets.$inferInsert;
