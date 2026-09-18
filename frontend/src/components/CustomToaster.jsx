import React from 'react'
import { useToaster, toast, resolveValue } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'

/**
 * Parses message string or element.
 * If the message contains semicolons (;) or newlines (\n), it breaks them into
 * individual items to be rendered line-by-line.
 */
function parseMessage(message, toastObj) {
  const resolved = resolveValue(message, toastObj)
  if (typeof resolved !== 'string') {
    return { isMulti: false, items: [resolved] }
  }

  const parts = resolved
    .split(/;\s*|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    isMulti: parts.length > 1,
    items: parts.length > 0 ? parts : [resolved],
  }
}

export default function CustomToaster() {
  const { toasts, handlers } = useToaster({
    duration: 5000,
    error: {
      duration: 6000,
    },
    success: {
      duration: 4000,
    },
  })

  const { startPause, endPause } = handlers

  return (
    <div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[99999] flex flex-col gap-3 pointer-events-none max-w-[92vw] sm:max-w-[430px] w-full"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      <AnimatePresence mode="popLayout">
        {toasts
          .filter((t) => t.visible)
          .map((t) => {
            const { isMulti, items } = parseMessage(t.message, t)

            // Theme configurations based on toast type
            const isError = t.type === 'error'
            const isSuccess = t.type === 'success'
            const isLoading = t.type === 'loading'

            let borderColor = 'border-l-[#3F72AF]'
            let iconElement = <InfoOutlinedIcon sx={{ fontSize: 20 }} className="text-[#3F72AF]" />
            let headerText = 'Notification'
            let headerColor = 'text-[#3F72AF]'

            if (isError) {
              borderColor = 'border-l-red-500'
              iconElement = <ErrorOutlineIcon sx={{ fontSize: 22 }} className="text-red-500" />
              headerText = isMulti ? 'Please Correct The Following:' : 'Validation Error'
              headerColor = 'text-red-600'
            } else if (isSuccess) {
              borderColor = 'border-l-emerald-500'
              iconElement = <CheckCircleOutlineIcon sx={{ fontSize: 22 }} className="text-emerald-500" />
              headerText = 'Success'
              headerColor = 'text-emerald-700'
            } else if (isLoading) {
              borderColor = 'border-l-[#3F72AF]'
              iconElement = (
                <div className="w-5 h-5 border-2 border-[#3F72AF]/30 border-t-[#3F72AF] rounded-full animate-spin" />
              )
              headerText = 'Processing'
              headerColor = 'text-[#3F72AF]'
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.94, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                className="pointer-events-auto w-full"
              >
                <div
                  className={`
                    relative flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md
                    rounded-xl border border-[#DBE2EF] border-l-4 ${borderColor}
                    shadow-[0_10px_30px_-5px_rgba(17,45,78,0.18),0_4px_6px_-2px_rgba(17,45,78,0.05)]
                    transition-all duration-200 hover:shadow-[0_15px_35px_-5px_rgba(17,45,78,0.22)]
                  `}
                  role="alert"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">{iconElement}</div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    {/* Header line for multi-line or distinct feedback */}
                    {(isMulti || isError) && (
                      <p className={`font-sans font-bold text-[11px] uppercase tracking-wider mb-1.5 ${headerColor}`}>
                        {headerText}
                      </p>
                    )}

                    {isMulti ? (
                      /* Line by line list */
                      <ul className="space-y-1.5">
                        {items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 font-sans text-xs sm:text-[13px] text-[#112D4E] font-medium leading-relaxed"
                          >
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-bold mt-0.5 flex-shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <span className="flex-1 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      /* Single line message */
                      <div className="font-sans text-xs sm:text-[13px] text-[#112D4E] font-medium leading-relaxed break-words">
                        {items[0]}
                      </div>
                    )}
                  </div>

                  {/* Close button */}
                  {!isLoading && (
                    <button
                      type="button"
                      onClick={() => toast.dismiss(t.id)}
                      className="flex-shrink-0 p-1 rounded-md text-[#112D4E]/40 hover:text-[#112D4E] hover:bg-[#DBE2EF]/50 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
      </AnimatePresence>
    </div>
  )
}
