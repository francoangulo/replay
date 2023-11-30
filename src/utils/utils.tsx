export const getRandomPastelColor = (number: number) => {
  const random = Math.random();
  console.log("franco param number", JSON.stringify(number, null, 4));
  console.log("franco random number", JSON.stringify(random, null, 4));
  const h = Math.floor((number || Math.random()) * 360);
  const s = 70;
  const l = 85;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
