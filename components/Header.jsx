import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
import { Calendar, CreditCard, ShieldCheck, Sparkles, Stethoscope, User , Pill , Map, ChevronDown } from 'lucide-react'
import { checkAndAllocateCredits } from '@/actions/credits'
import { Badge } from './ui/badge'
import Pricing from './pricing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"





const Header = async () => {

 const user = await checkUser();
 if(user?.role==="PATIENT"){
  await checkAndAllocateCredits(user);
 }

  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60'>
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href="/">
                <Image 
                src="/logo.png"
                alt='MediCure Logo'
                width={250}
                height={80}
                className='h-15 w-auto object-contain'
                />
            </Link>

            <div className='flex items-center space-x-3'>

            {/* Types of dashboard options based on role */}

              <SignedIn>

                {user?.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="secondary" className="hidden md:inline-flex items-center gap-2 cursor-pointer">

                      <ShieldCheck className='h-4 w-4' />
                      Admin Dashboard
                    </Button>

                    <Button variant="outline" className="md:hidden w-10 h-10 p-0 cursor-pointer">

                      <ShieldCheck className='h-4 w-4' />

                    </Button>
                  
                  </Link>
                )}
                
                {user?.role === "DOCTOR" && (
                  <Link href="/doctor">
                    <Button variant="secondary" className="hidden md:inline-flex items-center gap-2 cursor-pointer">

                      <Stethoscope className='h-4 w-4' />
                      Doctor Dashboard
                    </Button>

                    <Button variant="outline" className="md:hidden w-10 h-10 p-0 cursor-pointer">

                      <Stethoscope className='h-4 w-4' />

                    </Button>
                  
                  </Link>
                )}



                
                {user?.role === "PATIENT" && (
                  <>
                    <Link href="/appointments">
                      <Button variant="secondary" className="hidden md:inline-flex items-center gap-2 cursor-pointer">
                        <Calendar className='h-4 w-4' />
                        Manage Appointments
                      </Button>
                      <Button variant="outline" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                        <Calendar className='h-4 w-4' />
                      </Button>
                    </Link>

                    {/* Desktop Health Tools Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="hidden md:inline-flex items-center gap-2 cursor-pointer ml-2">
                          <Stethoscope className='h-4 w-4' />
                          Health Tools
                          <ChevronDown className='h-4 w-4'  />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-56">
                        <DropdownMenuItem asChild>
                          <Link href="/telemedicine-pharmacy" className="flex items-center gap-2">
                            <Pill className="h-4 w-4" />
                            Telemedicine Pharmacy
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/ai-health-consultant" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Health Consultant
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/hospital-locator" className="flex items-center gap-2">
                            <Map className="h-4 w-4" />
                            Hospital Locator
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Health Tools Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="md:hidden w-10 h-10 p-0 cursor-pointer ml-2">
                          <Stethoscope className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-56">
                        <DropdownMenuItem asChild>
                          <Link href="/telemedicine-pharmacy" className="flex items-center gap-2">
                            <Pill className="h-4 w-4" />
                            Telemedicine Pharmacy
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/ai-health-consultant" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Health Consultant
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/hospital-locator" className="flex items-center gap-2">
                            <Map className="h-4 w-4" />
                            Hospital Locator
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}


                {user?.role === "UNASSIGNED" && (
                  <Link href="/onboarding">
                    <Button variant="secondary"
                    className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                    >

                      <User className='h-4 w-4' />

                      Complete Profile

                    </Button>

                    <Button variant="outline" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                        <User className='h-4 w-4' />
                    </Button>                 
                  </Link>
                )}
              </SignedIn>

                {(!user || user?.role === "PATIENT") && (
              <Link href="/pricing">
                <Badge
                  variant="outline"
                  className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
                >
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">
                    {user && user.role === "PATIENT" ? (
                      <>
                        {user.credits}{" "}
                        <span className="hidden md:inline">
                          Credits
                        </span>
                      </>
                    ) : (
                      <>Pricing</>
                    )}
                  </span>
                </Badge>
              </Link>
            )}

              



              <SignedOut>
                  <SignInButton>

                      <Button className="cursor-pointer">Sign In</Button>
                  </SignInButton>

                </SignedOut>

                <SignedIn>
                  <UserButton />
                </SignedIn>
            </div>
        </nav>
    </header>
  )
}

export default Header
