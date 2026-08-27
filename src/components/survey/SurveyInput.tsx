type SurveyInputProps = { title: string; name: string; placeholder: string; required?: boolean }

export function SurveyInput({ title, name, placeholder, required = false }: SurveyInputProps) {
  return <label className="survey-card"><strong>{title}{required && <i> *</i>}</strong>{required && <small>필수</small>}<input name={name} required={required} placeholder={placeholder} /></label>
}
