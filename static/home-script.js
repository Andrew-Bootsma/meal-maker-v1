function searchRecipes() {
  const searchQuery = document.getElementById('searchBar').value.toLowerCase();
  const cardsContainer = document.getElementById('cardsContainer');
  const cards = cardsContainer.getElementsByClassName('card');

  Array.from(cards).forEach((card) => {
    const recipeTitle = card
      .querySelector('.recipeTitle')
      .innerText.toLowerCase();
    if (recipeTitle.includes(searchQuery)) {
      card.parentElement.style.display = ''; // Show the card
    } else {
      card.parentElement.style.display = 'none'; // Hide the card
    }
  });
}
