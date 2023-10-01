/**
 * 錨點
 */
(function () {
  function anchorTo(target) {
    const targetSection = document.querySelector(target);
    window.scrollTo({
      top: targetSection ? targetSection.offsetTop : 0,
      behavior: 'smooth',
    });
  }
  function anchorClick(e) {
    let isTarget = false;
    const allAnchorBtn = document.querySelectorAll('.anchor-btn');
    for (const targetElement of allAnchorBtn) {
      if (targetElement.contains(e.target) || e.target.closest('.anchor-btn') === targetElement) {
        isTarget = true;
        break;
      }
    }
    if (isTarget) {
      const anchorTarget = e.target.closest('.anchor-btn').getAttribute('anchor-target');
      anchorTo(anchorTarget);
    }
  }

  document.addEventListener('click', anchorClick);
})();
