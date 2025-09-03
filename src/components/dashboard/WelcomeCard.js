import { Typography, Box, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Card } from '@/components/ui/card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useSoftUIController } from '@/context'

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})(({ theme, isDark }) => ({
  background: isDark 
    ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(33, 150, 243, 0.25) 50%, rgba(25, 118, 210, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(33, 150, 243, 0.15) 50%, rgba(66, 165, 245, 0.1) 100%)',
  borderRadius: '20px',
  boxShadow: isDark 
    ? '0 8px 32px rgba(100, 181, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 8px 32px rgba(25, 118, 210, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: isDark 
    ? '1px solid rgba(100, 181, 246, 0.2)' 
    : '1px solid rgba(25, 118, 210, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '140px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: isDark 
      ? '0 12px 40px rgba(100, 181, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      : '0 12px 40px rgba(25, 118, 210, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
  }
}))

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})(({ isDark }) => ({
  position: 'absolute',
  right: '-20px',
  bottom: '-20px',
  opacity: isDark ? 0.15 : 0.1,
  color: isDark ? '#64b5f6' : '#1976d2',
}))

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
  padding: '24px',
})

export default function WelcomeCard({ totalSaldo }) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  const theme = useTheme()

  return (
    <StyledCard isDark={isDarkMode}>
      <ContentWrapper>
        <Typography 
          variant="h3" 
          sx={{
            fontWeight: 700,
            mb: 2,
            color: isDarkMode ? '#ffffff' : '#1976d2',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          Sistem Bendahara COCONUT Computer Club
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            mb: 4,
            color: isDarkMode ? '#b0b0b0' : '#666666',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.5,
          }}
        >
          Kelola keuangan organisasi komputer dengan mudah dan transparan.
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: isDarkMode ? '#90caf9' : '#1976d2',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Total Kas Organisasi
        </Typography>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            mt: 1,
            color: isDarkMode ? '#64b5f6' : '#1565c0',
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            textShadow: isDarkMode 
              ? '0 2px 10px rgba(100, 181, 246, 0.3)' 
              : '0 2px 10px rgba(25, 118, 210, 0.2)',
          }}
        >
          {totalSaldo}
        </Typography>
      </ContentWrapper>
      <IconWrapper isDark={isDarkMode}>
        <AccountBalanceWalletIcon sx={{ fontSize: '180px' }} />
      </IconWrapper>
    </StyledCard>
  )
}