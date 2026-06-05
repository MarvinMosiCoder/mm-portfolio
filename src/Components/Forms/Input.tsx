import React from "react";

export type InputProps = {
  label: string;
  name: string; // matches keys from the parent form
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
};

// Infer a sensible HTML input type from the field name
const inputTypeFor = (name: string): string => {
  if (name === "email") return "email";
  if (name === "website" || name === "linkedin") return "url";
  if (name === "phone") return "tel";
  return "text";
};

const autoCompleteFor = (name: string): string | undefined => {
  switch (name) {
    case "name":
      return "name";
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "address":
      return "street-address";
    case "website":
      return "url";
    case "linkedin":
      return "url";
    default:
      return undefined;
  }
};

const Input: React.FC<InputProps> = ({ label, name, value, onChange,required }) => {

  const commonProps = {
    name,
    value,
    onChange,
    required,
    className: "w-full rounded-xl border p-3 focus:outline-none focus:ring",
    autoComplete: autoCompleteFor(name),
    placeholder: label,
  } as const;

  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {name === "profile_text" ? (
        <textarea rows={4} {...(commonProps as any)} />
      ) : (
        <input type={inputTypeFor(name)} {...(commonProps as any)} />
      )}
    </label>
  );
};

export default Input;
