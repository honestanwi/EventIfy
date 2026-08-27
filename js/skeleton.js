/* =========================================================
   EVENTIFY SKELETON LOADING
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  /* =========================
     HOMEPAGE
  ========================= */

  if (
    path.endsWith("index.html") ||
    path.endsWith("/") ||
    path.endsWith("\\")
  ) {
    showHomeSkeleton();
  }

  /* =========================
     EVENTS PAGE
  ========================= */

  if (path.endsWith("event.html")) {
    showEventsSkeleton();
  }

  /* =========================
     EVENT DETAIL PAGE
  ========================= */

  if (path.endsWith("event-detail.html")) {
    showDetailSkeleton();
  }
});

/* =========================================================
   EVENT CARD SKELETON
========================================================= */

function eventCardSkeleton() {
  return `
    <div class="skeleton-event-card">

      <div class="skeleton skeleton-event-image"></div>

      <div class="skeleton-event-content">

        <div class="skeleton skeleton-category"></div>

        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-title short"></div>

        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>

      </div>

    </div>
  `;
}

/* =========================================================
   HOMEPAGE
========================================================= */

function showHomeSkeleton() {
  const featured = document.getElementById("featured-events");
  const topPicks = document.getElementById("top-picks");

  if (!featured || !topPicks) return;

  featured.innerHTML = "";
  topPicks.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    featured.innerHTML += eventCardSkeleton();
    topPicks.innerHTML += eventCardSkeleton();
  }
}

/* =========================================================
   EVENTS PAGE
========================================================= */

function showEventsSkeleton() {
  const containers = [
    "art-cards",
    "concert-cards",
    "sport-cards",
    "tech-cards",
    "conference-cards",
  ];

  containers.forEach((id) => {
    const container = document.getElementById(id);

    if (!container) return;

    container.innerHTML = `
      <div class="event-grid skeleton-event-grid">

        ${eventCardSkeleton()}
        ${eventCardSkeleton()}
        ${eventCardSkeleton()}
        ${eventCardSkeleton()}

      </div>
    `;
  });
}

/* =========================================================
   EVENT DETAIL PAGE
========================================================= */

function showDetailSkeleton() {
  const image = document.getElementById("event-image");
  const category = document.getElementById("event-category");
  const title = document.getElementById("event-title");

  const date = document.getElementById("event-date");
  const time = document.getElementById("event-time");
  const location = document.getElementById("event-location");

  const description = document.getElementById("event-description");
  const highlights = document.getElementById("event-highlights");
  const organizer = document.getElementById("event-organizer");

  const tickets = document.getElementById("ticket-types-grid");
  const similar = document.getElementById("similar-events");

  /* -------------------------
     IMAGE
  ------------------------- */

  if (image) {
    image.style.display = "none";

    image.parentElement.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="skeleton skeleton-detail-image"
             id="detail-image-skeleton"></div>
      `,
    );
  }

  /* -------------------------
     CATEGORY
  ------------------------- */

  if (category) {
    category.innerHTML = `
      <span class="skeleton skeleton-detail-category"></span>
    `;
  }

  /* -------------------------
     TITLE
  ------------------------- */

  if (title) {
    title.innerHTML = `
      <span class="skeleton skeleton-detail-title"></span>
    `;
  }

  /* -------------------------
     INFO
  ------------------------- */

  [date, time, location].forEach((element) => {
    if (!element) return;

    element.innerHTML = `
      <span class="skeleton skeleton-info-value"></span>
    `;
  });

  /* -------------------------
     DESCRIPTION
  ------------------------- */

  if (description) {
    description.innerHTML = `
      <span class="skeleton skeleton-paragraph"></span>
      <span class="skeleton skeleton-paragraph"></span>
      <span class="skeleton skeleton-paragraph medium"></span>
      <span class="skeleton skeleton-paragraph short"></span>
    `;
  }

  /* -------------------------
     HIGHLIGHTS
  ------------------------- */

  if (highlights) {
    highlights.innerHTML = `
      <li class="skeleton skeleton-highlight"></li>
      <li class="skeleton skeleton-highlight"></li>
      <li class="skeleton skeleton-highlight"></li>
      <li class="skeleton skeleton-highlight"></li>
    `;
  }

  /* -------------------------
     ORGANIZER
  ------------------------- */

  if (organizer) {
    organizer.innerHTML = `
      <span class="skeleton skeleton-organizer-name"></span>
    `;
  }

  /* -------------------------
     TICKETS
  ------------------------- */

  if (tickets) {
    tickets.innerHTML = "";

    for (let i = 0; i < 3; i++) {
      tickets.innerHTML += `
        <div class="skeleton-ticket">

          <div class="skeleton skeleton-ticket-title"></div>

          <div class="skeleton skeleton-ticket-price"></div>

          <div class="skeleton skeleton-ticket-line"></div>
          <div class="skeleton skeleton-ticket-line"></div>
          <div class="skeleton skeleton-ticket-line"></div>

          <div class="skeleton skeleton-ticket-button"></div>

        </div>
      `;
    }
  }

  /* -------------------------
     SIMILAR EVENTS
  ------------------------- */

  if (similar) {
    similar.innerHTML = "";

    for (let i = 0; i < 4; i++) {
      similar.innerHTML += eventCardSkeleton();
    }
  }
}

/* =========================================================
   REMOVE DETAIL IMAGE SKELETON
========================================================= */

function removeDetailImageSkeleton() {
  const skeleton = document.getElementById("detail-image-skeleton");

  if (skeleton) {
    skeleton.remove();
  }
}
