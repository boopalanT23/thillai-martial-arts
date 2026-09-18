import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import SearchIcon from '@mui/icons-material/Search'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DownloadIcon from '@mui/icons-material/Download'
import { studentAPI, paymentAPI } from '../services/api.js'

export default function MonthlyFees() {
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [student, setStudent]   = useState(null)
  const [due, setDue]           = useState(null)
  const [history, setHistory]   = useState([])
  const [paying, setPaying]     = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await studentAPI.search(query.trim())
      const s = res.data
      setStudent(s)
      const [dueRes, historyRes] = await Promise.allSettled([
        paymentAPI.getDue(s.studentId),
        paymentAPI.getHistory(s.studentId),
      ])
      if (dueRes.status === 'fulfilled') setDue(dueRes.value.data)
      if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data || [])
    } catch {
      setStudent(null)
      setDue(null)
      setHistory([])
      toast.error('Student not found. Check Student ID or Mobile Number.')
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!due || !student || due.amount <= 0) return
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading. Please refresh.')
      return
    }

    setPaying(true)
    try {
      const orderRes = await paymentAPI.createOrder({
        amount: due.amount * 100,
        currency: 'INR',
        receipt: `FEE_${student.studentId}_${Date.now()}`,
        notes: { studentId: student.studentId, name: student.name },
      })

      const orderData = orderRes.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'Thillai Martial Arts Club',
        description: `Monthly Fee - ${student.name}`,
        prefill: {
          name: student.name,
          contact: student.mobile,
        },
        theme: {
          color: '#3F72AF',
        },
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              studentId: student.studentId,
            })
            toast.success('Monthly fee payment successful!')
            const [dueRes, historyRes] = await Promise.allSettled([
              paymentAPI.getDue(student.studentId),
              paymentAPI.getHistory(student.studentId),
            ])
            if (dueRes.status === 'fulfilled') setDue(dueRes.value.data)
            if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data || [])
          } catch (verifyErr) {
            console.error('Payment verify error:', verifyErr)
            toast.error(verifyErr.response?.data?.message || 'Payment verification failed.')
          } finally {
            setPaying(false)
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false)
            toast.error('Payment cancelled.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error)
        toast.error(response.error?.description || 'Payment failed.')
        setPaying(false)
      })
      razorpay.open()
    } catch (err) {
      console.error('Create order error:', err)
      toast.error(err.response?.data?.message || 'Could not initiate payment.')
      setPaying(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Online Fee Portal</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            MONTHLY FEES PAYMENT
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Enter your Student ID (e.g. TMA0001) or registered mobile number to check dues and pay online.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7] min-h-[60vh]">
        <div className="container-pad max-w-3xl mx-auto">

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <SearchIcon sx={{ fontSize: 20, color: '#3F72AF' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter Student ID or Mobile Number"
                className="input-tma pl-11 font-sans"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-8 !py-3.5 font-sans font-semibold text-xs tracking-wider">
              {loading ? 'SEARCHING…' : 'SEARCH DUES'}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {student && due && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Student summary */}
                <div className="card-tma p-6 sm:p-8 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#DBE2EF] flex items-center justify-center font-display font-black text-[#112D4E] text-2xl flex-shrink-0">
                      {student.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0 flex-1 font-sans">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight">{student.name}</p>
                        <span className="badge-tma font-sans text-xs">
                          {student.batchName || 'General Batch'}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#112D4E]/60 mt-0.5">
                        Student ID: <strong className="text-[#3F72AF] font-bold">{student.studentId}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Course Statuses */}
                  <div className="pt-4 border-t border-[#DBE2EF]">
                    <p className="font-sans text-xs text-[#112D4E] font-bold uppercase tracking-wider mb-3">
                      Enrolled Courses &amp; Fee Status
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {((due?.courseDetails && due.courseDetails.length > 0)
                        ? due.courseDetails
                        : (student?.courseFeeDetails || [])
                      ).map((c, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] flex items-center justify-between text-xs font-sans"
                        >
                          <div className="truncate mr-2">
                            <p className="font-display font-bold text-[#112D4E] uppercase text-base tracking-tight truncate">{c.courseName}</p>
                            <p className="font-sans text-[11px] text-[#112D4E]/60">Monthly Fee: ₹{c.fee}</p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold tracking-wider uppercase ${
                              c.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {c.status === 'PAID' ? 'PAID ✓' : 'UNPAID ⏳'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Due amount banner */}
                <div className={`p-8 rounded-xl border ${due.amount > 0 ? 'border-[#3F72AF] bg-[#DBE2EF]/40' : 'border-emerald-300 bg-emerald-50/50'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider">
                      {due.amount > 0 ? 'Amount Due for Current Month' : 'Fee Status'}
                    </p>
                    {due.totalMonthlyFee && (
                      <p className="font-sans text-xs text-[#112D4E]/70">
                        Total Fee: <strong className="text-[#112D4E]">₹{due.totalMonthlyFee}</strong>
                        {due.paidAmount ? ` | Paid: ₹${due.paidAmount}` : ''}
                      </p>
                    )}
                  </div>

                  {due.amount > 0 ? (
                    <>
                      <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#112D4E] mb-1 leading-none">₹{due.amount}</p>
                      <p className="font-sans text-xs text-[#112D4E]/60 mb-6">For {due.month || 'current month'}</p>
                      <button onClick={handlePay} disabled={paying} className="btn-primary !py-3.5 !px-8 text-xs font-sans font-semibold tracking-wider">
                        {paying ? 'PROCESSING…' : `PAY ₹${due.amount} NOW`}
                      </button>
                    </>
                  ) : (
                    <p className="font-display text-2xl font-bold text-emerald-700 uppercase tracking-wide">All Monthly Fees Paid — You're All Set! ✓</p>
                  )}
                </div>

                {/* Payment History */}
                <div className="card-tma p-6 sm:p-8">
                  <h3 className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight mb-4 flex items-center gap-2">
                    <ReceiptLongIcon sx={{ fontSize: 20, color: '#3F72AF' }} /> Payment History
                  </h3>

                  {history.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-[#DBE2EF]">
                      <table className="admin-table font-sans">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map(h => (
                            <tr key={h.id}>
                              <td className="font-sans text-xs text-[#112D4E]/80">{h.date}</td>
                              <td className="font-sans text-xs font-semibold text-[#112D4E] uppercase">{h.month}</td>
                              <td className="font-display font-bold text-base text-[#112D4E]">₹{h.amount}</td>
                              <td>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                  {h.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await paymentAPI.downloadInvoice(h.id)
                                      const blob = new Blob([res.data], { type: 'application/pdf' })
                                      const url = window.URL.createObjectURL(blob)
                                      const link = document.createElement('a')
                                      link.href = url
                                      link.download = `invoice-${h.id}.pdf`
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                      window.URL.revokeObjectURL(url)
                                      toast.success('Invoice downloaded')
                                    } catch {
                                      toast.error('Could not download invoice')
                                    }
                                  }}
                                  className="text-[#3F72AF] hover:text-[#112D4E] p-1 rounded hover:bg-[#DBE2EF] transition-colors"
                                  aria-label="Download invoice"
                                >
                                  <DownloadIcon sx={{ fontSize: 18 }} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="font-sans text-xs text-[#112D4E]/60 text-center py-4">No payment history recorded yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {searched && !loading && !student && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-tma p-10 text-center"
              >
                <p className="font-display font-bold text-xl text-[#112D4E] uppercase mb-1 tracking-tight">Student Not Found</p>
                <p className="font-sans text-xs text-[#112D4E]/70 mb-4">
                  We could not find any active student matching "<span className="font-semibold">{query}</span>".
                </p>
                <p className="font-sans text-xs text-[#112D4E]/60">
                  Please verify your Student ID (format TMA0001) or 10-digit mobile number.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </motion.div>
  )
}
