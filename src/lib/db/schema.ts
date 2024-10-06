import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core'

export const  userSystemEnum  = pgEnum('userSystemEnum', ['system', 'user'])

export const chats = pgTable('chats',{
    id: serial('id').primaryKey(),
    pdfName: text('pdfName').notNull(),
    pdfUrl: text('pdfUrl').notNull(),
    timeCreated: timestamp('timeCreated').notNull().defaultNow(),
    userId:  varchar('userId',{length:256}).notNull(),
    fileKey: text('fileKey').notNull(),
})

export const messages = pgTable('messages',{
    id: serial('id').primaryKey(),
    chatId: integer('chatId').references(() => chats.id).notNull(),
    content: text('content').notNull(),
    timeCreated: timestamp('timeCreated').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
})