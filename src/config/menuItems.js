import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AssessmentIcon from '@mui/icons-material/Assessment'

export const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pemasukan', icon: <PaymentsIcon />, path: '/pemasukan' },
  { text: 'Pengeluaran', icon: <ReceiptIcon />, path: '/pengeluaran' },
  { text: 'Laporan Keuangan', icon: <AssessmentIcon />, path: '/laporan' },
]