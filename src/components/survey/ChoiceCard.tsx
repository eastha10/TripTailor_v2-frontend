type ChoiceCardProps = { title: string; name: string; choices: string[] }

export function ChoiceCard({ title, name, choices }: ChoiceCardProps) {
  return <fieldset className="survey-card"><legend>{title}</legend>{choices.map(choice => <label className="radio-row" key={choice}><input type="radio" name={name} value={choice} /><span>{choice}</span></label>)}</fieldset>
}
