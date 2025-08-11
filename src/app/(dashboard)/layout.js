import DashboardLayout from '@/components/Layout'

export default function Page({ children }) {
  return (
    <DashboardLayout>
      {/* Your page content */}
      {children}
    </DashboardLayout>
  )
}