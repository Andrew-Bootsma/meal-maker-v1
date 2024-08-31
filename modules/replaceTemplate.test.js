const replaceTemplate = require('./replaceTemplate');

describe('replaceTemplate', () => {
  it('should replace placeholders with recipe data', () => {
    const template = '<div>{%RECIPENAME%} - {%ID%} - {%IMAGE%}</div>';
    const recipe = {
      recipeName: 'Chicken Salad',
      id: '1234',
      image: 'img.jpg',
    };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div>Chicken Salad - 1234 - img.jpg</div>');
  });

  it('should handle missing highProtein property by adding "notHighProtein" class', () => {
    const template = '<div class="{%NOT_HIGHPROTEIN%}">{%RECIPENAME%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div class="notHighProtein">Chicken Salad</div>');
  });

  it('should not add "notHighProtein" class if highProtein is true', () => {
    const template = '<div class="{%NOT_HIGHPROTEIN%}">{%RECIPENAME%}</div>';
    const recipe = {
      recipeName: 'Chicken Salad',
      id: '1234',
      highProtein: true,
    };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div class="{%NOT_HIGHPROTEIN%}">Chicken Salad</div>');
  });

  it('should ignore placeholders not present in the recipe object', () => {
    const template = '<div>{%UNKNOWN%} - {%RECIPENAME%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div>{%UNKNOWN%} - Chicken Salad</div>');
  });
});
