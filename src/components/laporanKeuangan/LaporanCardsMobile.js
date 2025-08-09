import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

export default function LaporanCardsMobile({ filteredData, formatDateTime, formatRupiah }) {
  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
      {filteredData.map((row, index) => (
        <Card key={row.id_pemasukan || row.id_pengeluaran || index} sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'visible', bgcolor: 'background.paper' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Tanggal</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDateTime(row.tanggal)}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Keterangan</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{row.keterangan}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Nominal</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f' }}>
                {row.pemasukan > 0 ? `+ ${formatRupiah(row.pemasukan)}` : `- ${formatRupiah(row.pengeluaran)}`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Saldo</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatRupiah(row.total_saldo)}</Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
      {filteredData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="body1" color="textSecondary">Tidak ada data untuk periode ini</Typography>
        </Box>
      )}
    </Box>
  );
}
