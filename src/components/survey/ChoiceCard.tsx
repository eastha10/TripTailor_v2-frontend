type Choice = string | { label: string; value: string }
type ChoiceCardProps = { title: string; name: string; choices: Choice[] }

export function ChoiceCard({ title, name, choices }: ChoiceCardProps) {
  return <fieldset className="survey-card"><legend>{title}</legend>{choices.map(choice => { const item = typeof choice === 'string' ? { label: choice, value: choice } : choice; return <label className="radio-row" key={item.value}><input type="radio" name={name} value={item.value} /><span>{item.label}</span></label> })}</fieldset>
}
