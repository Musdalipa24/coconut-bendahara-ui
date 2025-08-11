'use client'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/config/menuItems'

export default function MenuItems({ darkMode, miniSidenav }) {
  const pathname = usePathname()

  return (
    <>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          component={Link}
          href={item.path}
          selected={pathname === item.path}
          sx={{
            borderRadius: '12px',
            mb: 1,
            py: 1,
            color: darkMode ? '#fff' : 'inherit',
            '&.Mui-selected': {
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#4caf50',
              color: '#fff',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: darkMode ? '#fff' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          {!miniSidenav && (
            <ListItemText primary={item.text} />
          )}
        </ListItem>
      ))}
    </>
  )
}