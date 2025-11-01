import { Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/datepicker.css"

interface CustomDatePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  withTime?: boolean
}

export function CustomDatePicker({
  name,
  control,
  label,
  placeholder = "Selecione a data",
  withTime = false
}: CustomDatePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="relative w-full ">
          <DatePicker
            id={name}
            placeholderText={placeholder}
            selected={field.value}
            onChange={field.onChange}
            showTimeSelect={withTime}
            dateFormat={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
            timeFormat="HH:mm"
            timeIntervals={15}
            wrapperClassName="w-full"
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 hover:border-slate-600 transition-all duration-200 px-4 py-3 text-sm font-medium outline-none"
            calendarClassName="modern-datepicker"
            popperClassName="z-50"
            popperPlacement="bottom-start"
          />
        </div>
      )}
    />
  )
}
