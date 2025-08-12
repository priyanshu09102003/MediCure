"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { creditBenefits, features } from "@/lib/data";
import { ArrowRight, CheckCircle, Stethoscope , DollarSign, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import Pricing from "@/components/pricing";

const appVideos = [
  {
    id: 1,
    title: "App Features Overview",
    description: "Discover all the powerful features that make healthcare accessible and convenient",
    thumbnail: "/video-thumbnail-1.png", 
    youtubeId: "3vNdXKeqTyU" 
  },
  {
    id: 2,
    title: "Our Mission",
    description: "Addressing the problem statement - Why I Built This App",
    thumbnail: "/video-thumbnail-2.png", 
    youtubeId: "pFmoE-QaapY" 
  },
  {
    id: 3,
    title: "Complete App Walkthrough",
    description: "Master Your Health Journey - Full App Tutorial",
    thumbnail: "/video-thumbnail-3.png", 
    youtubeId: "dQw4w9WgXcQ" 
  }
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideoDialog = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoDialog = () => {
    setSelectedVideo(null);
  };


  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-34">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left */}
            <div className="space-y-12">
              <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium">Healthcare made simple</Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Connect with your doctors <br /> <span className="gradient-title">Anytime, Anywhere...  </span>
              </h1>
                
              <p className="text-muted-foreground text-sm max-w-md">
                Book appointments with certified doctors, consult via secure video calls, or get instant AI-powered health guidance—anytime, anywhere. Manage prescriptions, order medicines, and track your wellness, all within a single, trusted platform. Seamless, secure, and designed for your health.
              </p>
                
              <div className="flex flex-col sm:flex-row gap-5">
                <Button asChild size="lg" className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700">
                  <Link href={'/onboarding'}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                  
                <Button variant="secondary" asChild size="lg" className="cursor-pointer border-emerald-700/30 hover:bg-muted/80">
                  <Link href={'/doctors'}>
                    Find Doctors <Stethoscope className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
                
            {/* Right - Fixed Image Container */}
            <div className="relative h-[450px] lg:h-[550px] rounded-xl overflow-hidden">
              <Image 
                src="/banner.png" 
                alt="banner-image" 
                fill 
                priority
                className="object-contain object-center rounded-xl"
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features of the app */}

      <section className="py-20 bg-muted/30">

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works?</h2>
            
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
              Smart and simplified healthcare solutions, in just a few steps
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature , index) => {
              return(

                <Card key={index} className="bg-emerald-900/20 hover:border-white transition-all duration-300 cursor-pointer">
                  <CardHeader className="text-xl font-semibold text-white">
                    <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                      {feature.icon}
                    </div>

                    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>

              )
            })}
          </div>
        </div>

      </section>

      {/* Pricing */}

      <section className="py-20">
            <div className="container mx-auto px-4">

              <div className="text-center mb-16">

                <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-10">Affordable Pricing</Badge>
                
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Consultation Packages</h2>
                  
                  <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
                    Choose the perfect consultation package that fits your healthcare needs.
                    </p>
               </div>


               <div>

                {/* SUBSCRIPTIONS */}

                <Pricing />



                
                {/* Benefits of the credit system */}
                  <Card className="mt-12 bg-muted/20 border-emerald-900/30">
                      <CardHeader>

                        <CardTitle className="text-xl font-semibold text-white flex items-center">
                          <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
                          How Our Credit System Works?
                        </CardTitle>

                      </CardHeader>
                      <CardContent>
                          <ul className="space-y-3">
                            {creditBenefits.map((benefit, index) => {
                              return (
                                <li key={index} className="flex items-start gap-3 md:text-lg lg:text-lg">
                                  <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                                  </div>
                                  <p
                                    className="text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: benefit }}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                    </Card>
                

               </div>

            </div>
      
      </section>

      {/* Video Section */}

       <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-10">Learn & Explore</Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Related Videos</h2>
            
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
              Watch our step-by-step guides to make the most of our healthcare platform
            </p>
          </div>

          {/* Video Cards Container */}
          <Card className="bg-muted/20 border-emerald-900/30 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appVideos.map((video) => (
                <div key={video.id} className="flex flex-col items-center">
                  {/* Large Video Thumbnail Card */}
                  <Card 
                    className="w-full h-64 bg-emerald-900/20 hover:bg-emerald-900/30 border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => openVideoDialog(video)}
                  >
                    <CardContent className="p-0 h-full">
                      <div className="relative w-full h-full overflow-hidden rounded-lg bg-emerald-900/10">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                        />
                        {/* Play button overlay - only visible on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg opacity-0 group-hover:opacity-100">
                          <div className="bg-emerald-600 hover:bg-emerald-500 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Video Description below the card */}
                  <p className="text-white text-lg font-bold text-white mt-6 text-center max-w-sm">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>


                            


      {/* CTA */}

      <section className="py-20">

        <div className="container mx-auto px-4">
            
            <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20">

                <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden" >

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold gradient-title">
                      Start your journey to a healthier life, today.
                    </h2>
                    <p className="font-medium text-muted-foreground mb-8">
                       Join now and transform your healthcare experience. Fast, simple, and seamless—the way healthcare should be.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">

                      <Button 
                      asChild
                      size="lg"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Link href="/sign-up">Sign Up Now <ArrowRight className="h-4 w-4" /></Link>
                      </Button>


                      <Button 
                      variant="secondary"
                      asChild
                      size="lg"
                      className="border-emerald-400/70 hover:bg-muted/80"
                      >
                        <Link href="/pricing">View Pricing <DollarSign className="h-4 w-4" /> </Link>
                      </Button>


                    </div>
                  </div>

                </CardContent>

            </Card>
               
        </div>

      </section>

      {/* Video Dialog */}

      <Dialog open={selectedVideo !== null} onOpenChange={closeVideoDialog}>
        <DialogContent className="max-w-7xl w-[95vw] bg-background border-emerald-900/30">
          <DialogHeader>
            <DialogTitle className="text-white text-sm pr-8">
              {selectedVideo?.description}
            </DialogTitle>
          </DialogHeader>
          
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>

      
    </div>
  );
}