type SurveyInputProps = { title: string; placeholder: string; required?: boolean }

export function SurveyInput({ title, placeholder, required = false }: SurveyInputProps) {
  return <label className="survey-card"><strong>{title}{required && <i> *</i>}</strong>{required && <small>필수</small>}<input required={required} placeholder={placeholder} /></label>
}
