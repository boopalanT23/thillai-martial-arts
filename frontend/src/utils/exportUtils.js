import toast from 'react-hot-toast'

export const triggerBlobDownload = (data, defaultFilename, mimeType) => {
  const blob = new Blob([data], { type: mimeType || 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', defaultFilename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const downloadStudentsExcel = async (studentAPI) => {
  const toastId = toast.loading('Generating Students Excel sheet...')
  try {
    const res = await studentAPI.exportExcel()
    const filename = `thillai_students_${new Date().toISOString().slice(0, 10)}.xlsx`
    triggerBlobDownload(
      res.data,
      filename,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    toast.success('Students Excel sheet downloaded!', { id: toastId })
  } catch (err) {
    console.error('Export Excel failed:', err)
    toast.error('Failed to export Excel sheet. Please try again.', { id: toastId })
  }
}

export const downloadStudentsPDF = async (adminAPI) => {
  const toastId = toast.loading('Generating Students PDF report...')
  try {
    const res = await adminAPI.exportStudentsPDF()
    const filename = `thillai_students_${new Date().toISOString().slice(0, 10)}.pdf`
    triggerBlobDownload(res.data, filename, 'application/pdf')
    toast.success('Students PDF report downloaded!', { id: toastId })
  } catch (err) {
    console.error('Export Students PDF failed:', err)
    toast.error('Failed to export Students PDF report', { id: toastId })
  }
}

export const downloadPaymentsPDF = async (adminAPI) => {
  const toastId = toast.loading('Generating Payments PDF ledger...')
  try {
    const res = await adminAPI.exportPaymentsPDF()
    const filename = `thillai_payments_${new Date().toISOString().slice(0, 10)}.pdf`
    triggerBlobDownload(res.data, filename, 'application/pdf')
    toast.success('Payments PDF ledger downloaded!', { id: toastId })
  } catch (err) {
    console.error('Export Payments PDF failed:', err)
    toast.error('Failed to export Payments PDF ledger', { id: toastId })
  }
}
