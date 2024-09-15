import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import React, { useEffect, useState } from 'react';
import { TEMPELATE } from '../_components/TempelateSection';
import Templates from '@/app/(data)/Templates';
import { desc, eq } from 'drizzle-orm';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface HISTORY {
    id: Number,
    formData: string,
    aiResponse: string,
    tempelateSlug: string,
    createdBy: string,
    createdAt: string,
}


 async function History(){
    const user = await currentUser();
    
       
           
            // @ts-ignore
            const HistoryList: HISTORY[] = await db.select().from(AIOutput)
                .where(eq(AIOutput?.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(AIOutput.id));
    const getTemplateName = (slug: string) => {
        const template: TEMPELATE | any = Templates.find((item) => item.slug==slug);
        return template;
    };

    
    return (
        <div className='m-5 p-5 border rounded-lg bg-white'>
            <h2 className='font-bold text-3xl'>HISTORY</h2>
            <p className='text-gray-500'>Search your previously generated AI content</p>
            <div className='grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3'>
                <h2 className='col-span-2'>TEMPLATE</h2>
                <h2 className='col-span-2'>AI RESP</h2>
                <h2>DATE</h2>
                <h2>WORDS</h2>
                <h2>COPY</h2>
            </div>
            {HistoryList.map((item: HISTORY, index: number) => (
                <>
                    <div className='grid grid-cols-7 my-5 py-3 px-3'>
                        <h2 className='col-span-2 flex gap-2 items-center'>
                            <Image src={getTemplateName(item?.tempelateSlug)?.icon} alt='History_Image' width={25} height={25} />
                            {getTemplateName(item.tempelateSlug)?.name}
                        </h2>
                        <h2 className='col-span-2 line-clamp-3'>{item?.aiResponse}</h2>
                        <h2>{item?.createdAt}</h2>
                        <h2>{item?.aiResponse.length}</h2>
                        <h2>
                            <Button variant='ghost' className='text-primary'>Copy</Button>
                        </h2>
                    </div>
                </>
            ))}
        </div>
    );
};

export default History;
