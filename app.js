document.addEventListener("DOMContentLoaded", () => {
  const yearTargets = document.querySelectorAll("[data-year]");
  const currentYear = new Date().getFullYear();
  yearTargets.forEach((item) => { item.textContent = currentYear; });

  const menuButton = document.querySelector(".menu-btn");
  const siteNav = document.querySelector(".site-nav");
  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const search = document.querySelector("#sharingSearch");
  const cards = Array.from(document.querySelectorAll(".listing"));
  const filters = Array.from(document.querySelectorAll(".filter"));
  const categoryButtons = Array.from(document.querySelectorAll("[data-jump-filter]"));
  const emptyState = document.querySelector("#emptyState");
  let activeFilter = "all";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) return;
    const query = normalize(search ? search.value : "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchable = normalize(card.dataset.search + " " + card.textContent);
      const categoryMatch = activeFilter === "all" || category === activeFilter;
      const searchMatch = !query || searchable.includes(query);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  function setFilter(filterName) {
    activeFilter = filterName;
    filters.forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === filterName);
    });
    applyFilters();
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter || "all"));
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.jumpFilter || "all");
      document.querySelector("#resourceDirectory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (search) search.addEventListener("input", applyFilters);
  applyFilters();
});
