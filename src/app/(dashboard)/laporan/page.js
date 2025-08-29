'use client'

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Fade, 
  Select, 
  InputLabel, 
  Alert, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { laporanService } from '@/services/laporanService';
import { AnimatedContainer, AnimatedTypography, StyledFormControl } from '@/components/laporanKeuangan/styles';
import SummaryCards from '@/components/laporanKeuangan/SummaryCards';
import LaporanTable from '@/components/laporanKeuangan/LaporanTable';
import LaporanCardsMobile from '@/components/laporanKeuangan/LaporanCardsMobile';
import DownloadMenu from '@/components/laporanKeuangan/DownloadMenu';

export default function LaporanKeuangan() {
  const [data, setData] = useState([])
  const [darkMode, setDarkMode] = useState(false)
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
  const [pdfPreview, setPdfPreview] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
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

  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-'
    try {
      const [datePart, timePart] = backendDateString.split(' ')
      const [day, month, year] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return new Date(year, month - 1, day, hours, minutes).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      console.error('Error formatting date:', e)
      return backendDateString
    }
  }

  const getDateRange = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    switch (range) {
      case 'today':
        return { start: formatDate(today), end: formatDate(today.setHours(24, 0, 0, 0)) }
      case 'yesterday':
        startDate.setDate(today.getDate() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '7days':
        startDate.setDate(today.getDate() - 7)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '1month':
        startDate.setMonth(today.getMonth() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '3months':
        startDate.setMonth(today.getMonth() - 3)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '6months':
        startDate.setMonth(today.getMonth() - 6)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case 'all':
      default:
        return { start: null, end: null }
    }
  }

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
      
      // Sort data by date (newest to oldest - newest at top for website display)
      const sortedData = [...rangeData].sort((a, b) => {
        if (!a.tanggal || !b.tanggal) return 0
        try {
          // Parse backend date format (DD-MM-YYYY HH:mm)
          const [datePartA, timePartA] = a.tanggal.split(' ')
          const [dayA, monthA, yearA] = datePartA.split('-')
          const [hoursA, minutesA] = timePartA ? timePartA.split(':') : ['00', '00']
          const dateA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA)
          
          const [datePartB, timePartB] = b.tanggal.split(' ')
          const [dayB, monthB, yearB] = datePartB.split('-')
          const [hoursB, minutesB] = timePartB ? timePartB.split(':') : ['00', '00']
          const dateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB)
          
          return dateB - dateA // Descending order (newest first at top for website)
        } catch (e) {
          console.error('Error parsing dates for sorting:', e)
          return 0
        }
      })
      
      setData(sortedData)
      setFilteredData(sortedData)
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

  const formatRupiah = (number) => {
    const validNumber = Number.isFinite(Number(number)) ? Number(number) : 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validNumber)
  }

  const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const base64 = canvas.toDataURL('image/png')
        resolve({
          base64,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        })
      }
      img.onerror = reject
      img.src = src
    })
  }

  const generatePDF = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4') // Changed to portrait A4
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      
      // Margin 4433: Top=40mm, Left=40mm, Bottom=30mm, Right=30mm
      const marginTop = 20 
      const marginLeft = 30
      const marginBottom = 30
      const marginRight = 30
      
      let currentY = 15  // Start from very top

      // Set font
      doc.setFont('times', 'normal')

      // Load logo
      let logoData = null
      try {
        logoData = await loadImageAsBase64('/logo.png')
      } catch (error) {
        console.log('Could not load logo, using fallback')
      }

      // HEADER SECTION - FIXED AT TOP OF PAGE
      const createHeader = () => {
        // Header with Logo and Organization Info
        const logoHeight = 20 // Smaller logo for header
        let logoWidth = logoHeight
        let logoX = marginLeft
        let logoY = 15 // Fixed at top
        
        // Calculate proper logo dimensions if we have the image
        if (logoData) {
          logoWidth = logoHeight * logoData.aspectRatio
          // Make sure logo doesn't take too much space horizontally (max 25mm)
          const maxLogoWidth = 25
          if (logoWidth > maxLogoWidth) {
            logoWidth = maxLogoWidth
            logoHeight = logoWidth / logoData.aspectRatio
          }
        }
        
        // Add logo
        if (logoData) {
          doc.addImage(logoData.base64, 'PNG', logoX, logoY, logoWidth, logoHeight)
        } else {
          // Fallback: create a placeholder circle for the logo
          const fallbackSize = Math.min(logoWidth, logoHeight)
          doc.setDrawColor(41, 121, 255)
          doc.setFillColor(41, 121, 255)
          doc.circle(logoX + fallbackSize/2, logoY + fallbackSize/2, fallbackSize/2, 'F')
          
          // Add anchor symbol in the circle (simplified representation)
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(10)
          doc.setFont('times', 'bold')
          doc.text('C', logoX + fallbackSize/2, logoY + fallbackSize/2 + 2, { align: 'center' })
        }

        // Organization header text - CENTERED layout
        const centerX = pageWidth / 2
        const textY = logoY + 5
        
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(9)
        doc.setFont('times', 'bold')
        doc.text('COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY', centerX, textY, { align: 'center' })
        
        doc.setFontSize(10)
        doc.setFont('times', 'bold')
        doc.text('(COCONUT)', centerX, textY + 6, { align: 'center' })
        
        // Address and contact info - CENTERED
        doc.setFontSize(8)
        doc.setFont('times', 'normal')
        doc.text('Sekretariat: Jl. Monumen Emmy Saelan III No. 70 Karuntung, Kec. Rappocini, Makassar', centerX, textY + 11, { align: 'center' })
        
        // Contact info with blue website
        const contactY = textY + 16
        const contactText = 'Telp. 085240791254/089580126297, Website: '
        const websiteText = 'www.coconut.or.id'
        const emailText = ' , Email: hello@coconut.or.id'

        // Calculate text widths for positioning
        const contactWidth = doc.getTextWidth(contactText)
        const websiteWidth = doc.getTextWidth(websiteText)
        const emailWidth = doc.getTextWidth(emailText)
        const totalWidth = contactWidth + websiteWidth + emailWidth
        
        // Start position for centered text
        const startX = centerX - (totalWidth / 2)
        
        // Draw contact info (black)
        doc.setTextColor(0, 0, 0)
        doc.text(contactText, startX, contactY)
        
        // Draw website (blue)
        doc.setTextColor(0, 0, 255)
        doc.text(websiteText, startX + contactWidth, contactY)
        
        // Draw email (black)
        doc.setTextColor(0, 0, 0)
        doc.text(emailText, startX + contactWidth + websiteWidth, contactY)

        // Header separator lines (three lines like in the image)
        const headerEndY = logoY + Math.max(logoHeight, 19) + 4
        doc.setDrawColor(100, 100, 100)
        doc.setLineWidth(0.1)
        doc.line(marginLeft, headerEndY, pageWidth - marginRight, headerEndY)
        
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.4)
        doc.line(marginLeft, headerEndY + 0.9, pageWidth - marginRight, headerEndY + 0.9)

        doc.setDrawColor(100, 100, 100)
        doc.setLineWidth(0.1)
        doc.line(marginLeft, headerEndY + 1.9, pageWidth - marginRight, headerEndY + 1.9)

        return headerEndY + 8 // Return Y position after header
      }

      // FOOTER FUNCTION (without page numbers - added later)
      const createFooter = () => {
        const footerY = pageHeight - 15 // Fixed at bottom
        doc.setFontSize(6)
        doc.setFont('times', 'normal')
        doc.setTextColor(100, 100, 100)
        
        // Credit text on the left
        doc.text('Dibuat oleh Sistem Keuangan Organisasi COCONUT Computer Club', marginLeft, footerY)
      }

      // FUNCTION TO ADD PAGE NUMBERS AFTER ALL CONTENT IS CREATED
      const addPageNumbers = () => {
        const totalPages = doc.internal.getNumberOfPages()
        
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i)
          const footerY = pageHeight - 15
          doc.setFontSize(6)
          doc.setFont('times', 'normal')
          doc.setTextColor(100, 100, 100)
          
          // Page number on the right
          const str = `Halaman ${i} dari ${totalPages}`
          doc.text(str, pageWidth - marginRight, footerY, { align: 'right' })
        }
      }

      // Create header and get starting position for content
      currentY = createHeader()

      // Content starts after header
      currentY += 5

      // Title for the report
      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      doc.setFont('times', 'bold')
      doc.text('LAPORAN KEUANGAN', pageWidth / 2, currentY, { align: 'center' })
      currentY += 6

      const periodLabel = timeRangeOptions.find(opt => opt.value === timeRange)?.label || 'Semua'
      
      // Generate actual date range for period display
      let periodText = 'Periode: '
      if (timeRange === 'all') {
        // For 'all', find the date range from actual data
        if (filteredData && filteredData.length > 0) {
          const dates = filteredData.map(item => {
            if (item.tanggal) {
              // Parse backend date format (DD-MM-YYYY HH:mm)
              const [datePart] = item.tanggal.split(' ')
              const [day, month, year] = datePart.split('-')
              return new Date(year, month - 1, day)
            }
            return null
          }).filter(Boolean).sort((a, b) => a - b)
          
          if (dates.length > 0) {
            const startDate = dates[0]
            const endDate = dates[dates.length - 1]
            const formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
            periodText += `${startDate.toLocaleDateString('id-ID', formatOptions)} - ${endDate.toLocaleDateString('id-ID', formatOptions)}`
          } else {
            periodText += 'Tidak ada data'
          }
        } else {
          periodText += 'Tidak ada data'
        }
      } else {
        // For specific ranges, calculate the actual dates
        const { start, end } = getDateRange(timeRange)
        if (start && end) {
          const startDate = new Date(start)
          const endDate = new Date(end)
          endDate.setDate(endDate.getDate() - 1) // Adjust end date to be inclusive
          const formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
          periodText += `${startDate.toLocaleDateString('id-ID', formatOptions)} - ${endDate.toLocaleDateString('id-ID', formatOptions)}`
        } else {
          periodText += periodLabel
        }
      }
      
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.setFont('times', 'normal')
      doc.text(periodText, pageWidth / 2, currentY, { align: 'center' })
      currentY += 10

      // Ringkasan Keuangan
      doc.setFontSize(10)
      doc.setFont('times', 'bold')
      doc.text('Ringkasan Keuangan', marginLeft, currentY)
      currentY += 6

      const summaryData = [
        ['Total Pemasukan', formatRupiah(totalPemasukan)],
        ['Total Pengeluaran', formatRupiah(totalPengeluaran)],
        ['Saldo Akhir', formatRupiah(saldoAkhir)]
      ]

      autoTable(doc, {
        startY: currentY,
        head: [['Kategori', 'Jumlah']],
        body: summaryData,
        styles: {
          font: 'times',
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [25, 118, 210], // MUI primary color
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          halign: 'right',
          valign: 'middle',
          fontSize: 8
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 70 },
          1: { halign: 'right', cellWidth: 'auto' }
        },
        margin: { left: marginLeft, right: marginRight, bottom: 25, top: 55 }, // Added top margin for consistent spacing
        theme: 'grid',
        tableWidth: 'auto',
        didDrawPage: (data) => {
          // Add header to each page if needed
          if (data.pageNumber > 1) {
            createHeader()
          }
          // Add footer to each page
          createFooter()
        }
      })

      currentY = doc.lastAutoTable.finalY + 10

      // Tabel Transaksi
      doc.setFontSize(10)
      doc.setFont('times', 'bold')
      doc.text('Detail Transaksi', marginLeft, currentY)
      currentY += 6

      if (filteredData.length === 0) {
        doc.setFontSize(8)
        doc.setFont('times', 'italic')
        doc.setTextColor(100, 100, 100)
        doc.text('Tidak ada transaksi untuk periode ini', marginLeft, currentY)
      } else {
        const sortedData = [...filteredData].sort((a, b) => {
          if (!a.tanggal || !b.tanggal) return 0
          try {
            // Parse backend date format (DD-MM-YYYY HH:mm)
            const [datePartA, timePartA] = a.tanggal.split(' ')
            const [dayA, monthA, yearA] = datePartA.split('-')
            const [hoursA, minutesA] = timePartA ? timePartA.split(':') : ['00', '00']
            const dateA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA)
            
            const [datePartB, timePartB] = b.tanggal.split(' ')
            const [dayB, monthB, yearB] = datePartB.split('-')
            const [hoursB, minutesB] = timePartB ? timePartB.split(':') : ['00', '00']
            const dateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB)
            
            return dateA - dateB
          } catch (e) {
            console.error('Error parsing dates for sorting:', e)
            return 0
          }
        })

        const tableData = sortedData.map(row => [
          formatDateTime(row.tanggal),
          row.keterangan,
          formatRupiah(row.pemasukan || 0),
          formatRupiah(row.pengeluaran || 0),
          formatRupiah(row.total_saldo || 0)
        ])

        const tableColumns = ['Tanggal', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo']

        autoTable(doc, {
          startY: currentY,
          head: [tableColumns],
          body: tableData,
          styles: {
            font: 'times',
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [25, 118, 210], // MUI primary color
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
          },
          bodyStyles: {
            textColor: [0, 0, 0],
            valign: 'middle',
            fontSize: 8
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          columnStyles: {
            0: { cellWidth: 30, halign: 'center' },
            1: { cellWidth: 'auto', halign: 'left' },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' }
          },
          margin: { left: marginLeft, right: marginRight, bottom: 25, top: 55 }, // Added top margin to ensure content below header
          theme: 'grid',
          tableWidth: 'auto',
          didDrawPage: (data) => {
            // Add header to each page
            if (data.pageNumber > 1) {
              const headerEndY = createHeader()
              // Ensure table starts below header on new pages
              if (data.table && data.table.startPageY) {
                data.table.startPageY = headerEndY + 5
              }
            }
            // Add footer to each page
            createFooter()
          }
        })
      }

      // Add footer to first page
      createFooter()

      // Add page numbers to all pages after all content is generated
      addPageNumbers()

      // Generate PDF blob for preview
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      // Set preview state
      setPdfPreview({ url: pdfUrl, doc: doc })
      setShowPreview(true)
      handleClose()
    } catch (error) {
      console.error('Error generating PDF:', error)
      setAlert({
        open: true,
        message: 'Terjadi kesalahan saat membuat PDF',
        severity: 'error'
      })
    }
  }

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
        Tanggal: formatDateTime(row.tanggal),
        Keterangan: row.keterangan,
        Pemasukan: row.pemasukan || 0,
        Pengeluaran: row.pengeluaran || 0,
        Saldo: row.total_saldo || 0
      })))
      const colWidths = [
        { wch: 12 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
      ]
      ws['!cols'] = colWidths
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan')
      XLSX.writeFile(wb, 'laporan-keuangan.xlsx')
      handleClose()
    } catch (error) {
      console.error('Error exporting Excel:', error)
      setAlert({
        open: true,
        message: 'Terjadi kesalahan saat membuat Excel',
        severity: 'error'
      })
    }
  }

  const handleDownloadPDF = () => {
    if (pdfPreview && pdfPreview.doc) {
      pdfPreview.doc.save('laporan-keuangan-coconut.pdf')
    }
  }

  const handlePrintPDF = () => {
    if (pdfPreview && pdfPreview.url) {
      // Open PDF in new window for printing
      const printWindow = window.open(pdfPreview.url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    }
  }

  const handleClosePreview = () => {
    if (pdfPreview && pdfPreview.url) {
      URL.revokeObjectURL(pdfPreview.url)
    }
    setPdfPreview(null)
    setShowPreview(false)
  }

  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'all', label: 'Semua' }
  ]

  return (
    <AnimatedContainer maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent', borderRadius: '16px', padding: '24px' }}>
      <Fade in={alert.open}>
        <Alert
          severity={alert.severity}
          sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)', borderRadius: '12px' }}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Fade>

      {loading && isLoadingSummary ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          {/* Loading spinner */}
          <span className="loader" />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <span style={{ color: 'red' }}>{error}</span>
        </Box>
      ) : (
        <div>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
            <AnimatedTypography variant="h4" sx={{ fontWeight: 600, color: theme => theme.palette.mode === 'dark' ? '#42A5F5' : '#1976D2', textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Laporan Keuangan
            </AnimatedTypography>
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <StyledFormControl variant="outlined" size="large" sx={{ minWidth: { xs: '100%', sm: '250px' } }}>
                <InputLabel sx={{ color: darkMode ? '#90caf9' : undefined }}>Filter Periode</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Filter Periode"
                  sx={{
                    background: darkMode ? 'rgba(66,165,245,0.08)' : 'white',
                    color: darkMode ? '#fff' : '#1976D2',
                    borderRadius: '12px',
                    '& .MuiSelect-icon': {
                      color: darkMode ? '#90caf9' : '#1976D2',
                    },
                  }}
                >
                  {timeRangeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} sx={{ py: 1.5, px: 2 }}>{option.label}</MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <Button
                variant="outlined"
                onClick={() => fetchDataByRange(timeRange)}
                fullWidth={false}
                sx={theme => ({
                  borderRadius: '12px',
                  minWidth: { xs: '100%', sm: '120px' },
                  color: theme.palette.mode === 'dark' ? '#fff' : '#1976D2',
                  borderColor: theme.palette.mode === 'dark' ? '#fff' : '#1976D2',
                  background: theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.08)' : 'transparent',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? 'rgba(66,165,245,0.18)' : 'rgba(25,118,210,0.08)',
                    borderColor: theme.palette.mode === 'dark' ? '#90caf9' : '#1976D2',
                  },
                })}
              >
                Refresh Data
              </Button>
              <Button variant="contained" onClick={handleClick} fullWidth={false} sx={{ minWidth: { xs: '100%', sm: '160px' }, borderRadius: '12px', background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)' }}>
                Unduh Laporan
              </Button>
            </Box>
          </Box>

          {/* Summary Cards */}
          <SummaryCards
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            saldoAkhir={saldoAkhir}
            isLoadingSummary={isLoadingSummary}
            formatRupiah={formatRupiah}
          />

          {/* Download Menu */}
          <DownloadMenu
            anchorEl={anchorEl}
            open={open}
            handleClose={handleClose}
            generatePDF={generatePDF}
            exportToExcel={exportToExcel}
          />

          {/* Tabel Desktop */}
          <LaporanTable
            loading={loading}
            filteredData={filteredData}
            formatDateTime={formatDateTime}
            formatRupiah={formatRupiah}
          />

          {/* Kartu Mobile */}
          <LaporanCardsMobile
            filteredData={filteredData}
            formatDateTime={formatDateTime}
            formatRupiah={formatRupiah}
          />

          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <span style={{ color: '#888' }}>* Tampilan mobile menampilkan data dalam bentuk kartu untuk kemudahan membaca.</span>
          </Box>
        </div>
      )}

      {/* PDF Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Preview Laporan Keuangan
          </Typography>
          <IconButton onClick={handleClosePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {pdfPreview && (
            <iframe
              src={pdfPreview.url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="PDF Preview"
            />
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          gap: 1
        }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintPDF}
            sx={{ borderRadius: '8px' }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{ 
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)'
              }
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
}