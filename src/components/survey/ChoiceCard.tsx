type Choice = string | { label: string; value: string }
type ChoiceCardProps = { title: string; name: string; choices: Choice[]; required?: boolean }

export function ChoiceCard({ title, name, choices, required = false }: ChoiceCardProps) {
  return <fieldset className="survey-card"><legend>{title}{required && <i> *</i>}</legend>{required && <small>필수</small>}{choices.map(choice => { const item = typeof choice === 'string' ? { label: choice, value: choice } : choice; return <label className="radio-row" key={item.value}><input type="radio" name={name} value={item.value} required={required} /><span>{item.label}</span></label> })}</fieldset>
}
