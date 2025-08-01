"use client";

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useFetch from '@/hooks/use-fetch';
import { updateDoctorActiveStatus } from '@/actions/admin';
import { Ban, Loader2, Search, Stethoscope} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VerifiedDoctors = ({ doctors = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDoctor, setTargetDoctor] = useState(null);

  // Add safety check for doctors array
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const filteredDoctors = safeDoctors.filter((doctor) => {
    if (!doctor) return false;
    
    const query = searchTerm.toLowerCase();
    const name = doctor.name?.toLowerCase() || '';
    const specialty = doctor.specialty?.toLowerCase() || '';
    const email = doctor.email?.toLowerCase() || '';

    return (
      name.includes(query) ||
      specialty.includes(query) ||
      email.includes(query)
    );
  });

  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorActiveStatus);

  const handleStatusChange = async (doctor) => {
    if (!doctor?.name || !doctor?.id) {
      toast.error("Invalid doctor data");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to suspend ${doctor.name}?`
    );

    if (!confirm || loading) return;

    try {
      const formData = new FormData();
      formData.append("doctorId", doctor.id);
      formData.append("suspend", "true");

      setTargetDoctor(doctor);
      await submitStatusUpdate(formData);
    } catch (error) {
      console.error("Error updating doctor status:", error);
      toast.error("Failed to update doctor status");
      setTargetDoctor(null);
    }
  };

  useEffect(() => {
    if (data?.success && targetDoctor) {
      toast.success(`Suspended ${targetDoctor.name} successfully!`);
      setTargetDoctor(null);
    } else if (data && !data.success && targetDoctor) {
      toast.error("Failed to suspend doctor");
      setTargetDoctor(null);
    }
  }, [data, targetDoctor]);

  return (
    <div>
      <Card className="bg-muted/20 border-emerald-900/20">
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle className="md:text-2xl font-bold gradient-title">
                Manage Doctors
              </CardTitle>
              <CardDescription>
                View and manage all verified doctors of this platform
              </CardDescription>
            </div>

            <div className='relative w-full md:w-64'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder="Search Doctors..."
                className="pl-8 bg-background border-emerald-900/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              {searchTerm
                ? "No doctor matches your search"
                : "No verified doctors available"
              }
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredDoctors.map((doctor) => (
                <Card 
                  key={doctor.id}
                  className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                      <div className="flex items-center gap-3">
                        <div className='bg-muted/20 rounded-full p-2'>
                          <Stethoscope className='h-5 w-5 text-emerald-400' /> 
                        </div>
                        <div>
                          <h3 className='font-medium text-white'>
                            {doctor.name || 'Unknown Doctor'}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            ● {doctor.specialty || 'No specialty'} ● {doctor.experience || 0} years of experience
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 self-end md:self-auto'>
                        <Badge variant="outline" className="bg-green-900/30 border-green-900/10 text-green-400">
                          Active
                        </Badge>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="cursor-pointer border-red-900/30 hover:bg-red-900/10 text-red-400"
                          onClick={() => handleStatusChange(doctor)}
                          disabled={loading && targetDoctor?.id === doctor.id}
                        >
                          {loading && targetDoctor?.id === doctor.id ? (
                            <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                          ) : (
                            <Ban className='h-4 w-4 mr-1'/>
                          )}
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifiedDoctors;