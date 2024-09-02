module.exports = (temp, recipe) => {
  let output = temp.replace(/{%RECIPENAME%}/g, recipe.recipeName);
  output = output.replace(/{%ID%}/g, recipe.id);
  output = output.replace(/{%IMAGE%}/g, recipe.image);
  output = output.replace(/{%INGREDIENGS%}/g, recipe.ingredients);
  output = output.replace(/{%DESCRIPTION%}/g, recipe.description);
  output = output.replace(/{%DIRECTIONS%}/g, recipe.directions);
  output = output.replace(/{%SERVINGSIZE%}/g, recipe.servingSize);
  output = output.replace(/{%SERVINGTYPE%}/g, recipe.servingType);
  output = output.replace(/{%PROTEIN%}/g, recipe.protein);
  output = output.replace(/{%CALORIES%}/g, recipe.calories);

  if (!recipe.highProtein)
    output = output.replace(/{%NOT_HIGHPROTEIN%}/g, 'notHighProtein');
  return output;
};
