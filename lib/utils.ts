import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number | undefined | null)[][]) {
  const formattedRows = rows.map((row) =>
    row
      .map((cell) => {
        if (cell === null || cell === undefined) return '""'
        const str = String(cell).replace(/"/g, '""')
        return `"${str}"`
      })
      .join(',')
  )
  const csvContent = [headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','), ...formattedRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
