/* Runs before first paint. Kept as an external classic script so the CSP needs no inline allowance. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var stored = localStorage.getItem('theme');
    if (stored !== null && /^[0-4]$/.test(stored)) root.setAttribute('data-theme', stored);
  } catch (e) {
    /* storage can be blocked; the default theme is fine */
  }
  /* If the main bundle never signals ready, show everything without animation. */
  setTimeout(function () {
    if (!root.classList.contains('ready')) root.classList.add('reduce');
  }, 4500);
})();
