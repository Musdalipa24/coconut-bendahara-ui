import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Card } from '@/components/ui/card'

const StyledCard = styled(Card)(({ variant }) => {
  const gradients = {
    green: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    red: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
  }
  return {
    background: gradients[variant] || gradients.green,
    borderRadius: '16px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  }
})

const IconWrapper = styled(Box)({
  position: 'absolute',
  right: '-20px',
  bottom: '-20px',
  opacity: 0.2,
})

export default function StatCard({ variant, icon, title, value }) {
  return (
    <StyledCard variant={variant} sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
      <Box p={3}>
        <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>
      <IconWrapper>{icon}</IconWrapper>
    </StyledCard>
  )
}