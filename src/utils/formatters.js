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
    const [datePart] = backendDateString.split(' ')
    const parts = datePart.split(/[-/]/)
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`
      } else {
        // DD-MM-YYYY
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`
      }
    }
    const date = new Date(backendDateString)
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    return backendDateString
  } catch (e) {
    console.error('Error formatting date:', e)
    return backendDateString
  }
}