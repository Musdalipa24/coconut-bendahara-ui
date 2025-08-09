export const formatRupiah = (number) => {
  const validNumber = Number.isFinite(Number(number)) ? Number(number) : 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(validNumber)
}

export const formatDateTime = (backendDateString) => {
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

export const getDateRange = (range) => {
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

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}