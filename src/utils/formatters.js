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