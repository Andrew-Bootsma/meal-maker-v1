const request = require('supertest');
const server = require('./index');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const tempHome = fs.readFileSync(
  `${__dirname}/templates/template-home.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

describe('GET /', () => {
  it('should return a 200 status and the correct HTML content for the home page', async () => {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const expectedOutput = tempHome.replace('{%RECIPE_CARDS%}', cardsHtml);

    const response = await request(server).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<html');
    expect(response.text).toContain(cardsHtml);
    expect(response.text).toBe(expectedOutput);
  });
});

describe('GET /non-existent-path', () => {
  it('should return a 404 status and a "Page not found!" message', async () => {
    const response = await request(server).get('/non-existent-path');
    expect(response.status).toBe(404);
    expect(response.text).toBe('<h1>Page not found!</h1>');
  });
});

afterAll(() => {
  server.close();
});
