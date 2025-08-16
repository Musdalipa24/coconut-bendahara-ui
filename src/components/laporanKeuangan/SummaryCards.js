import React from 'react';
import { Grid, Typography } from '@mui/material';
import { StyledCard, IconWrapper } from './styles';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

export default function SummaryCards({ totalPemasukan, totalPengeluaran, saldoAkhir, isLoadingSummary, formatRupiah }) {
  return (
    <Grid container spacing={3} mb={4} justifyContent="space-between" alignItems="center">
      <Grid item xs={12} sm={4} minWidth={{ xs: '100%', sm: '350px' }}>
        <StyledCard variant="income" delay={0.2} sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '120px', sm: '140px' } }}>
          <IconWrapper>
            <TrendingUpIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
          </IconWrapper>
          <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Total Pemasukan
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPemasukan)}
          </Typography>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={4} minWidth={{ xs: '100%', sm: '350px' }}>
        <StyledCard variant="expense" delay={0.4} sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '120px', sm: '140px' } }}>
          <IconWrapper>
            <TrendingDownIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
          </IconWrapper>
          <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Total Pengeluaran
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPengeluaran)}
          </Typography>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={4} minWidth={{ xs: '100%', sm: '350px' }}>
        <StyledCard delay={0.6} sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '120px', sm: '140px' } }}>
          <IconWrapper>
            <AccountBalanceIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
          </IconWrapper>
          <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8, position: 'relative', zIndex: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Saldo Akhir
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, position: 'relative', zIndex: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {isLoadingSummary ? 'Memuat...' : formatRupiah(saldoAkhir)}
          </Typography>
        </StyledCard>
      </Grid>
    </Grid>
  );
}
