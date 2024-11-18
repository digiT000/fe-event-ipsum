interface InputFeld {
  type: "email" | "password" | "text";
  id: string;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
}

function InputField({ id, onChange, placeholder, type, value }: InputFeld) {
  return (
    <input
      type={type}
      id={id}
      className="bg-zinc-100 hover:bg-zinc-200 transition-all	 text-gray-900 text-sm rounded-sm  block w-full p-4 "
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  );
}

export default InputField;
