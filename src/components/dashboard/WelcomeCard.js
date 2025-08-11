import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Card } from '@/components/ui/card'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

const StyledCard = styled(Card)({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '140px',
})

const IconWrapper = styled(Box)({
  position: 'absolute',
  right: '-20px',
  bottom: '-20px',
  opacity: 0.2,
})

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
  padding: '24px',
})

export default function WelcomeCard({ totalSaldo }) {
  return (
    <StyledCard>
      <ContentWrapper>
        <Typography variant="h3" fontWeight={700} mb={2}>
          Sistem Bendahara COCONUT Computer Club
        </Typography>
        <Typography variant="body1" mb={4}>
          Kelola keuangan organisasi komputer dengan mudah dan transparan.
        </Typography>
        <Typography variant="body2">Total Kas Organisasi</Typography>
        <Typography variant="h4" fontWeight={700} mt={1}>
          {totalSaldo}
        </Typography>
      </ContentWrapper>
      <IconWrapper>
        <AccountBalanceWalletIcon sx={{ fontSize: '180px' }} />
      </IconWrapper>
    </StyledCard>
  )
}