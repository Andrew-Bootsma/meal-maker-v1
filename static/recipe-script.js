document.addEventListener('DOMContentLoaded', function () {
  const servingInput = document.getElementById('userServings');
  const servingForm = document.getElementById('servingForm');

  // Restore scroll position after page reload
  if (sessionStorage.getItem('scrollPosition')) {
    window.scrollTo(0, sessionStorage.getItem('scrollPosition'));
    sessionStorage.removeItem('scrollPosition'); // Clean up after restoring
  }

  servingInput.addEventListener('blur', function () {
    // Store the scroll position before form submission
    sessionStorage.setItem('scrollPosition', window.scrollY);
    servingForm.submit();
  });
});
