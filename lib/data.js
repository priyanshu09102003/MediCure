import {
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
  Bot,
  Pill,
  Map,
} from "lucide-react";

// JSON data for features
export const features = [
  {
    icon: <User className="h-6 w-6 text-emerald-400" />,
    title: "Create Your Profile",
    description:
      "Sign up and complete your profile to get personalized healthcare recommendations and services.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    title: "Book Appointments",
    description:
      "Browse doctor profiles, check availability, and book appointments that fit your schedule.",
  },
  {
    icon: <Video className="h-6 w-6 text-emerald-400" />,
    title: "Video Consultation",
    description:
      "Connect with doctors through secure, high-quality video consultations from the comfort of your home.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-emerald-400" />,
    title: "Consultation Credits",
    description:
      "Purchase credit packages that fit your healthcare needs with our simple subscription model.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    title: "Verified Doctors",
    description:
      "All healthcare providers are carefully vetted and verified to ensure quality care.",
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-400" />,
    title: "Medical Documentation",
    description:
      "Access and manage your appointment history, doctor's notes, and medical recommendations.",
  },
  {
    icon: <Bot className="h-6 w-6 text-emerald-400" />,
    title: "AI Health Consultants",
    description:
      "Access intelligent AI-powered health consultants available 24/7 in your dashboard for instant symptom assessment, health guidance, and comprehensive reports with personalized recommendations.",
  },
  {
    icon: <Pill className="h-6 w-6 text-emerald-400" />,
    title: "Telemedicine Pharmacy",
    description:
      "Seamlessly order prescription medications, over-the-counter drugs, and medical supplies through our integrated online pharmacy for your timely medication aid.",
  },
  {
    icon: <Map className="h-6 w-6 text-emerald-400" />,
    title: "Hospital Locator",
    description:
      "Find the nearest hospitals and healthcare facilities with real-time satellite mapping, navigation routes, and estimated travel times for emergency situations.",
  },
];

// JSON data for credit system benefits
export const creditBenefits = [
  "Each consultation requires <strong class='text-emerald-400'>2 credits</strong> regardless of duration",
  "Credits <strong class='text-emerald-400'>never expire</strong> - use them whenever you need",
  "Monthly subscriptions give you <strong class='text-emerald-400'>fresh credits every month</strong>",
  "Cancel or change your subscription <strong class='text-emerald-400'>anytime</strong> without penalties",
];