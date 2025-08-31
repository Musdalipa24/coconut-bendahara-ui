import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Card } from '@/components/ui/card'
import { useSoftUIController } from '@/context'

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'isDark',
})(({ variant, isDark }) => {
  const gradients = {
    green: {
      light: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 50%, rgba(102, 187, 106, 0.1) 100%)',
      dark: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.25) 50%, rgba(102, 187, 106, 0.2) 100%)',
      border: {
        light: 'rgba(76, 175, 80, 0.2)',
        dark: 'rgba(76, 175, 80, 0.3)'
      },
      shadow: {
        light: 'rgba(76, 175, 80, 0.15)',
        dark: 'rgba(76, 175, 80, 0.25)'
      }
    },
    red: {
      light: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 50%, rgba(239, 83, 80, 0.1) 100%)',
      dark: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.25) 50%, rgba(239, 83, 80, 0.2) 100%)',
      border: {
        light: 'rgba(244, 67, 54, 0.2)',
        dark: 'rgba(244, 67, 54, 0.3)'
      },
      shadow: {
        light: 'rgba(244, 67, 54, 0.15)',
        dark: 'rgba(244, 67, 54, 0.25)'
      }
    },
  }
  
  const variantConfig = gradients[variant] || gradients.green
  
  return {
    background: isDark ? variantConfig.dark : variantConfig.light,
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${isDark ? variantConfig.border.dark : variantConfig.border.light}`,
    boxShadow: isDark 
      ? `0 8px 32px ${variantConfig.shadow.dark}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      : `0 8px 32px ${variantConfig.shadow.light}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: isDark 
        ? `0 12px 40px ${variantConfig.shadow.dark}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`
        : `0 12px 40px ${variantConfig.shadow.light}, inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
    }
  }
})

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'isDark',
})(({ variant, isDark }) => {
  const iconColors = {
    green: isDark ? '#81c784' : '#4caf50',
    red: isDark ? '#e57373' : '#f44336',
  }
  
  return {
    position: 'absolute',
    right: '-20px',
    bottom: '-20px',
    opacity: isDark ? 0.15 : 0.1,
    color: iconColors[variant] || iconColors.green,
  }
})

export default function StatCard({ variant, icon, title, value }) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  const getTextColors = () => {
    if (variant === 'green') {
      return {
        title: isDarkMode ? '#81c784' : '#2e7d32',
        value: isDarkMode ? '#4caf50' : '#1b5e20',
        subtitle: isDarkMode ? '#a5d6a7' : '#388e3c'
      }
    } else if (variant === 'red') {
      return {
        title: isDarkMode ? '#e57373' : '#d32f2f',
        value: isDarkMode ? '#f44336' : '#b71c1c',
        subtitle: isDarkMode ? '#ffab91' : '#e53935'
      }
    }
    return {
      title: isDarkMode ? '#81c784' : '#2e7d32',
      value: isDarkMode ? '#4caf50' : '#1b5e20',
      subtitle: isDarkMode ? '#a5d6a7' : '#388e3c'
    }
  }

  const textColors = getTextColors()

  return (
    <StyledCard 
      variant={variant} 
      isDark={isDarkMode}
      sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}
    >
      <Box p={3}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: textColors.subtitle,
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            color: textColors.value,
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            textShadow: isDarkMode 
              ? `0 2px 10px ${textColors.value}40` 
              : `0 2px 10px ${textColors.value}30`,
          }}
        >
          {value}
        </Typography>
      </Box>
      <IconWrapper variant={variant} isDark={isDarkMode}>
        {icon}
      </IconWrapper>
    </StyledCard>
  )
}