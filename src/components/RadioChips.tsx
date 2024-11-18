interface RadioChips {
  value: number;
  name: string;
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

function RadioChips({ name, text, value, checked, onChange }: RadioChips) {
  return (
    <div className="relative cursor-pointer">
      <input
        type="radio"
        id="hosting-small"
        name={name}
        value={value}
        className="peer w-full h-full absolute opacity-0 cursor-pointer "
        onChange={onChange}
        checked={checked}
        required
      />
      <label
        htmlFor={text}
        className="min-w-max inline-block items-center justify-between w-fit p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-zinc-100 "
      >
        <div className="block">
          <div className="w-full text-sm font-semibold">{text}</div>
        </div>
      </label>
    </div>
  );
}

export default RadioChips;
