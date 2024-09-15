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
   const {user} =useUser();
   const{UpdateCreditUsage,setUpdateUsage}=useContext(UpdateCreditContext);
   const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext);
   const {totalusage,setTotalUsage}= useContext(TotalUsageContext);
   const[maxwords,setMaxWords]=useState(10000);
   useEffect(()=>{
     user&&GetData();
     user&&IsUserSubscribed();
   },[UpdateCreditUsage&&user])
   
   useEffect(()=>{user&&GetData()},[user]);
   const GetData=async()=>{
    // @ts-ignore
     const result:HISTORY[]=await db.select().from(AIOutput)
     .where(eq(AIOutput.createdBy,user?.primaryEmailAddress?.emailAddress))
     GetTotalUsage(result);
   }
   const GetTotalUsage=(result:HISTORY[])=>{
    let total:number = 0;
    result.forEach(element=>{
      total = total+Number(element.aiResponse?.length);
    })
    setTotalUsage(total);
    console.log(total);
   }
   const IsUserSubscribed=async()=>{
   const result=await db.select().from(UserSubscription)
   .where(eq(UserSubscription.email,user?.primaryEmailAddress?.emailAddress))
   if(result){
    setUserSubscription(true);
    setMaxWords(100000);
   }}
  return (
    <div>

     <div className='bg-primary p-3 text-white border rounded-lg'>
        <h2>Credits</h2>
        <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
            <div className='h-2 bg-white rounded-full' 
            style={{
                width: (totalusage/maxwords)*100+"%"
            }}>

            </div>
        </div>
        <h2 className='text-small my-2'>{totalusage}/{maxwords}Credits Used</h2>
     </div>
     <Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>
    </div>
  )
}
