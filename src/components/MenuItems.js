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
                        transition: 'background-color 0.2s, color 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: darkMode ? 'rgba(255,255,255,0.15)' : '#388e3c',
                            color: '#fff',
                            '& .MuiListItemIcon-root': {
                                color: '#fff',
                            },
                        },
                        '&:active, &:focus': {
                            bgcolor: darkMode ? 'rgba(255,255,255,0.25)' : '#1b5e20',
                            color: '#fff',
                            '& .MuiListItemIcon-root': {
                                color: '#fff',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 8,
                                bottom: 8,
                                width: '4px',
                                borderRadius: '4px',
                                background: darkMode ? '#fff' : '#1b5e20',
                                transition: 'background 0.2s',
                            },
                        },
                        '&.Mui-selected': {
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#4caf50',
                            color: '#fff',
                            '& .MuiListItemIcon-root': {
                                color: '#fff',
                            },
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