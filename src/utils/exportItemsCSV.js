import Papa from 'papaparse'

/**
 * Export only quote items to CSV (simplified version)
 * @param {Array} items - Quote items array
 * @returns {boolean} - Success status
 */
export function exportItemsToCSV(items) {
  // Validate data
  if (!items || items.length === 0) {
    throw new Error('❌ 請至少新增一個報價項目')
  }
  
  // Validate items have description
  const emptyItems = items.filter(item => !item.description || item.description.trim() === '')
  if (emptyItems.length > 0) {
    throw new Error('❌ 請填寫所有報價項目的品項名稱')
  }
  
  // Prepare CSV data - only items
  const csvData = items.map(item => ({
    '品項名稱': item.description || '',
    '數量': item.quantity || 0,
    '單價': item.unitPrice || 0,
    '小計': item.total || 0
  }))
  
  // Generate CSV string using papaparse
  const csv = Papa.unparse(csvData, {
    header: true,
    columns: ['品項名稱', '數量', '單價', '小計']
  })
  
  // Add UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\ufeff' + csv], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .slice(0, 15)
  const filename = `quote_items_${timestamp}.csv`
  
  // Create download link and trigger download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
  
  console.log('CSV 已成功生成並下載:', filename)
  return true
}
