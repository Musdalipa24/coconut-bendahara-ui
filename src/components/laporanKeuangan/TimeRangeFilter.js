import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material'
import { StyledFormControl } from './styles'

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

export const TimeRangeFilter = ({ timeRange, setTimeRange, fetchDataByRange }) => {
  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      width: { xs: '100%', sm: 'auto' },
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <StyledFormControl
        variant="outlined"
        size="large"
        sx={{
          minWidth: { xs: '100%', sm: '250px' }
        }}
      >
        <InputLabel>Filter Periode</InputLabel>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          label="Filter Periode"
        >
          {timeRangeOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <Button
        variant="outlined"
        onClick={() => fetchDataByRange(timeRange)}
        fullWidth={false}
        sx={{
          borderRadius: '12px',
          minWidth: { xs: '100%', sm: '120px' }
        }}
      >
        Refresh Data
      </Button>
    </Box>
  )
}