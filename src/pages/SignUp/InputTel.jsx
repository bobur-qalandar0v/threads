import { Input } from "antd";
import React from "react";

function InputTel({ value = "", onChange }) {
  const formatPhoneNumber = (value) => {
    let numbers = value.replace(/\D/g, "");

    if (numbers === "") return "";

    if (numbers.startsWith("88")) {
      numbers = "998" + numbers.slice(2);
    } else if (!numbers.startsWith("998")) {
      numbers = "998" + numbers;
    }

    if (numbers.length > 12) {
      numbers = numbers.slice(0, 12);
      l;
    }

    let formatted = `+${numbers.slice(0, 3)}`;
    if (numbers.length > 3) formatted += `(${numbers.slice(3, 5)}`;
    if (numbers.length > 5) formatted += `)${numbers.slice(5, 8)}`;
    if (numbers.length > 8) formatted += `-${numbers.slice(8, 10)}`;
    if (numbers.length > 10) formatted += `-${numbers.slice(10, 12)}`;

    return formatted;
  };

  const handleChange = (e) => {
    let rawValue = e.target.value;

    if (rawValue.length < value.length) {
      let numbers = rawValue.replace(/\D/g, "");

      if (numbers.length <= 3) {
        onChange("");
        return;
      }
    }
    onChange(formatPhoneNumber(e.target.value));
  };

  return (
    <Input
      className="input-field"
      inputMode="tel"
      onChange={handleChange}
      value={value}
      placeholder="+998(__)___-__-__"
    />
  );
}

export default InputTel;
