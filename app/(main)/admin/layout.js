import { verifyAdmin } from '@/actions/admin'
import PageHeader from '@/components/page-header';
import { AlertCircle, ShieldCheck, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

export const metadata = {
    title: "Admin Settings - MediCure",
    description: "Manage doctors, patients, and platform settings."
}

const AdminLayout = async({children}) => {
    
    const isAdmin = await verifyAdmin();
    
    if (!isAdmin) {
        redirect("/onboarding");
    }

    return (
        <div className='container mx-auto px-4 py-22'>
            <PageHeader icon={<ShieldCheck />} title="Admin Settings" />
            
            <Tabs defaultValue="pending" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <TabsList className="lg:col-span-1 bg-muted/30 border h-14 lg:h-40 flex flex-row lg:flex-col w-full p-2 lg:p-1 rounded-md lg:space-y-2 space-x-2 lg:space-x-0">
                    <TabsTrigger value="pending"
                        className="flex-1 lg:flex lg:items-center lg:justify-start lg:px-4 lg:py-3 w-full cursor-pointer"
                        >
                        <AlertCircle className='h-4 w-4 mr-2 hidden lg:inline' />
                        <span>Pending Verifications</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="doctor"
                        className="flex-1 lg:flex lg:items-center lg:justify-start lg:px-4 lg:py-3 w-full cursor-pointer"
                        >
                        <Users className='h-4 w-4 mr-2 hidden lg:inline' />
                        <span>Doctors</span>
                    </TabsTrigger>
                </TabsList>
                
                <div className='lg:col-span-3'>
                    {children}
                </div>
                        
            </Tabs>
        </div>
    )
}

export default AdminLayout