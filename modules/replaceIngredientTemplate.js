module.exports = (temp, ingredientValue, ingredientName) => {
  let output = temp.replace(/{%INGREDIENTVALUE%}/g, ingredientValue);
  output = output.replace(/{%INGREDIENTNAME%}/g, ingredientName);

  return output;
};
