module.exports = (temp, recipe) => {
  let output = temp.replace(/{%RECIPENAME%}/g, recipe.recipeName);
  output = output.replace(/{%ID%}/g, recipe.id);

  if (!recipe.highProtein)
    output = output.replace(/{%NOT_HIGHPROTEIN%}/g, 'not-high-protein');
  return output;
};
