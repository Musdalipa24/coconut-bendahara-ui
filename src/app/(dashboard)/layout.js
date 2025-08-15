import DashboardLayout from '@/components/Layout'
import { SessionProvider } from "next-auth/react";

export default function Page({ children }) {
  return (
    <DashboardLayout>
      {/* Your page content */}
      {children}
    </DashboardLayout>
  )
}