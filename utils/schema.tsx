import { pgTable,serial,text,varchar,boolean } from "drizzle-orm/pg-core";
export const AIOutput=pgTable('aiOutput',{
id:serial('id').primaryKey(),
formData:varchar('formData'),
aiResponse:text('aiResponse'),
tempelateSlug:varchar('tempelateSlug'),
createdBy:varchar('createdBy'),
createdAt:varchar('createdAt')
})

export const UserSubscription=pgTable('userSubscription',{
    id:serial('id').primaryKey(),
    email:varchar('email'),
    userName:varchar('userName'),
    active:boolean('active'),
    paymentId:varchar('paymentId'),
    joinDate:varchar('joinData')
})
