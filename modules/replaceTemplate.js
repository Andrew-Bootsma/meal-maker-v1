module.exports = (temp, recipe) => {
  let output = temp.replace(/{%RECIPENAME%}/g, recipe.recipeName);
  output = output.replace(/{%ID%}/g, recipe.id);
  output = output.replace(/{%IMAGE%}/g, recipe.image);

  if (!recipe.highProtein)
    output = output.replace(/{%NOT_HIGHPROTEIN%}/g, 'notHighProtein');
  return output;
};
