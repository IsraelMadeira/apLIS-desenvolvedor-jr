export const normalizeCpf = (value = "") => String(value).replace(/\D/g, "");

const isRepeatedDigits = (cpf) => /^(\d)\1{10}$/.test(cpf);

const calculateDigit = (slice, startFactor) => {
  let sum = 0;

  for (let i = 0; i < slice.length; i += 1) {
    sum += Number(slice[i]) * (startFactor - i);
  }

  const result = (sum * 10) % 11;
  return result === 10 ? 0 : result;
};

export const isValidCpf = (value) => {
  const cpf = normalizeCpf(value);

  if (!/^\d{11}$/.test(cpf) || isRepeatedDigits(cpf)) {
    return false;
  }

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
};
