"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useContext, useEffect, useState } from 'react'
import { HISTORY } from '../history/page';
import { TotalUsageContext } from '@/app/(context)/totalUsagecontext';
import { UpdateCreditContext } from '@/app/(context)/UpdateCreditUsage';
import { UserSubscriptionContext } from '@/app/(context)/UseRSubscription';

export default function Usage_track() {
   const { user } = useUser();
   const { UpdateCreditUsage, setUpdateUsage } = useContext(UpdateCreditContext);
   const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);
   const { totalusage, setTotalUsage } = useContext(TotalUsageContext);
   const [maxwords, setMaxWords] = useState(10000);

   useEffect(() => {
      if (user) {
         GetData();
         IsUserSubscribed();
      }
   }, [UpdateCreditUsage, user]);

   useEffect(() => {
      if (user) {
         GetData();
      }
   }, [user]);

   const GetData = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return; // Guard clause for safety

      // Fetch data from the database
      const result: HISTORY[] = await db.select().from(AIOutput)
         .where(eq(AIOutput.createdBy, user.primaryEmailAddress.emailAddress));
      
      GetTotalUsage(result);
   }

   const GetTotalUsage = (result: HISTORY[]) => {
      const total: number = result.reduce((acc, element) => {
         return acc + (Number(element.aiResponse?.length) || 0);
      }, 0);
      setTotalUsage(total);
      console.log(total);
   }

   const IsUserSubscribed = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return; // Guard clause for safety

      const result = await db.select().from(UserSubscription)
         .where(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress));

      if (result.length > 0) { // Check if there are results
         setUserSubscription(true);
         setMaxWords(100000);
      }
   }

   return (
      <div>
         <div className='bg-primary p-3 text-white border rounded-lg'>
            <h2>Credits</h2>
            <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
               <div className='h-2 bg-white rounded-full' 
                  style={{
                     width: (totalusage / maxwords) * 100 + "%"
                  }}>
               </div>
            </div>
            <h2 className='text-small my-2'>{totalusage}/{maxwords} Credits Used</h2>
         </div>
         <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
      </div>
   )
}
