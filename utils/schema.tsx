import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    formData: varchar('formData'),
    aiResponse: text('aiResponse'),
    templateSlug: varchar('templateSlug'), // Corrected spelling
    createdBy: varchar('createdBy'),
    createdAt: timestamp('createdAt').defaultNow(), // Optional: If you want to store timestamps
});

export const UserSubscription=pgTable('userSubscription',{
    id:serial('id').primaryKey(),
    email:varchar('email'),
    userName:varchar('userName'),
    active:boolean('active'),
    paymentId:varchar('paymentId'),
    joinDate:varchar('joinData')
})
