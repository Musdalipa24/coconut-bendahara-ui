'use client'

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { StyledFormControl } from './styles'

export default function PemasukanFilters({ 
  timeRange, 
  setTimeRange,
  timeRangeOptions 
}) {
  return (
    <StyledFormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: { xs: '100%', sm: '180px' },
        maxWidth: { xs: '600px', sm: '180px' }
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
  )
}