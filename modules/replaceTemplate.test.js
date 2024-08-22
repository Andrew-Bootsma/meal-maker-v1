const replaceTemplate = require('./replaceTemplate');

describe('replaceTemplate', () => {
  it('should replace placeholders with recipe data', () => {
    const template = '<div>{%RECIPENAME%} - {%ID%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div>Chicken Salad - 1234</div>');
  });

  it('should handle missing highProtein property by adding "not-high-protein" class', () => {
    const template = '<div class="{%NOT_HIGHPROTEIN%}">{%RECIPENAME%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div class="not-high-protein">Chicken Salad</div>');
  });

  it('should not add "not-high-protein" class if highProtein is true', () => {
    const template = '<div class="{%NOT_HIGHPROTEIN%}">{%RECIPENAME%}</div>';
    const recipe = {
      recipeName: 'Chicken Salad',
      id: '1234',
      highProtein: true,
    };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div class="{%NOT_HIGHPROTEIN%}">Chicken Salad</div>');
  });

  it('should replace multiple instances of the same placeholder', () => {
    const template = '<div>{%RECIPENAME%} - {%RECIPENAME%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div>Chicken Salad - Chicken Salad</div>');
  });

  it('should ignore placeholders not present in the recipe object', () => {
    const template = '<div>{%UNKNOWN%} - {%RECIPENAME%}</div>';
    const recipe = { recipeName: 'Chicken Salad', id: '1234' };
    const result = replaceTemplate(template, recipe);
    expect(result).toBe('<div>{%UNKNOWN%} - Chicken Salad</div>');
  });
});
