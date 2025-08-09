'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Fade,
  Alert,
  CircularProgress
} from '@mui/material'
import { laporanService } from '@/services/laporanService'
import { FinancialSummaryCards } from '@/components/laporanKeuangan/FinancialSummaryCards'
import { FinancialTable } from '@/components/laporanKeuangan/FinancialTable'
import { FinancialMobileCards } from '@/components/laporanKeuangan/FinancialMobileCards'
import { ExportMenu } from '@/components/laporanKeuangan/ExportMenu'
import { TimeRangeFilter } from '@/components/laporanKeuangan/TimeRangeFilter'
import { AnimatedTypography, AnimatedContainer } from '@/components/laporanKeuangan/styles'
import { getDateRange, formatDate } from '@/components/laporanKeuangan/utils'

export default function LaporanKeuangan() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [timeRange, setTimeRange] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [saldoAkhir, setSaldoAkhir] = useState(0)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })
  const open = Boolean(anchorEl)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoadingSummary(true)
        const [pemasukan, pengeluaran, saldo] = await Promise.all([
          laporanService.getTotalPemasukan(),
          laporanService.getTotalPengeluaran(),
          laporanService.getSaldo()
        ])
        setTotalPemasukan(Number.isFinite(pemasukan) ? pemasukan : 0)
        setTotalPengeluaran(Number.isFinite(pengeluaran) ? pengeluaran : 0)
        setSaldoAkhir(Number.isFinite(saldo) ? saldo : 0)
      } catch (error) {
        console.error('Error fetching summary:', error)
        setAlert({
          open: true,
          message: 'Gagal memuat ringkasan keuangan',
          severity: 'error'
        })
        setTotalPemasukan(0)
        setTotalPengeluaran(0)
        setSaldoAkhir(0)
      } finally {
        setIsLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [])

  const fetchDataByRange = async (range) => {
    try {
      setLoading(true)
      const { start, end } = getDateRange(range)
      console.log(start, "-", end)
      let rangeData
      if (!start || !end) {
        rangeData = await laporanService.getAllLaporan()
      } else {
        const startDate = formatDate(start)
        const endDate = formatDate(end)
        rangeData = await laporanService.getLaporanByDateRange(startDate, endDate)
      }
      setData(rangeData)
      setFilteredData(rangeData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
      setFilteredData([])
      setAlert({
        open: true,
        message: 'Gagal memuat data laporan',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataByRange(timeRange)
  }, [timeRange])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const generatePDF = () => {
    // PDF generation logic
  }

  const exportToExcel = () => {
    // Excel export logic
  }

  return (
    <AnimatedContainer maxWidth="lg" sx={{
      mt: 4,
      mb: 4,
      backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <Fade in={alert.open}>
        <Alert
          severity={alert.severity}
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Fade>

      {loading && isLoadingSummary ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <div>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <AnimatedTypography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme => theme.palette.mode === 'dark' ? '#42A5F5' : '#1976D2',
                textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Laporan Keuangan
            </AnimatedTypography>
            <Box sx={{
              display: 'flex',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TimeRangeFilter 
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                fetchDataByRange={fetchDataByRange}
              />
              <ExportMenu 
                anchorEl={anchorEl}
                open={open}
                handleClick={handleClick}
                handleClose={handleClose}
                generatePDF={generatePDF}
                exportToExcel={exportToExcel}
              />
            </Box>
          </Box>

          <FinancialSummaryCards 
            isLoadingSummary={isLoadingSummary}
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            saldoAkhir={saldoAkhir}
          />

          <FinancialTable loading={loading} filteredData={filteredData} />
          <FinancialMobileCards filteredData={filteredData} />

          <Box sx={{
            display: { xs: 'block', md: 'none' },
            mt: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              * Tampilan mobile menampilkan data dalam bentuk kartu untuk kemudahan membaca.
            </Typography>
          </Box>
        </div>
      )}
    </AnimatedContainer>
  )
}