const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const menuLinks = document.querySelectorAll("#menu a");
const counters = document.querySelectorAll(".counter");
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  menu.classList.toggle("active");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    menu.classList.remove("active");
  });
});

const featuredContainer = document.getElementById("featured-events");
const topPicksContainer = document.getElementById("top-picks");

let allEvents = [];

// Same card structure as your Events page
function createEventCard(event) {
  const price =
    event.price === 0 ? "Free" : `${event.price.toLocaleString()} XAF`;

  const eventDate = new Date(`${event.date}T00:00:00`);

  const month = eventDate.toLocaleDateString("en-US", {
    month: "short",
  });

  const day = eventDate.getDate();
  const year = eventDate.getFullYear();

  return `
    <article class="event-card">

      <div class="event-card-content">

        <time class="event-date" datetime="${event.date}">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
          <span class="event-yr">${year}</span>
          <span class="event-time">${event.time}</span>
        </time>

        <p class="event-category">${event.category}</p>

        <h3 class="event-title">${event.title}</h3>

        <p class="event-location">
          ${event.venue}, ${event.location}
        </p>

        <div class="event-actions">
          <a
            class="event-details-button"
            href="pages/event-detail.html?id=${event.id}"
          >
            View details
          </a>
        </div>

      </div>

      <div class="event-card-media">
        <img
          class="event-image"
          src="${event.image.replace("../", "")}"
          alt="${event.title}"
          loading="lazy"
        />
      </div>

    </article>
  `;
}

// Load events
async function loadHomeEvents() {
  try {
    const response = await fetch("js/json/event.json");

    if (!response.ok) {
      throw new Error("Could not load events.");
    }

    allEvents = await response.json();

    displayHomeEvents();
  } catch (error) {
    console.error(error);

    featuredContainer.innerHTML = `<p class="event-error">Could not load featured events.</p>`;

    topPicksContainer.innerHTML = `<p class="event-error">Could not load top picks.</p>`;
  }
}

// Choose which events go where
function displayHomeEvents() {
  const featuredIds = [103, 109, 123, 140, 110, 135];
  const topPickIds = [102, 110, 125, 139, 121, 122];

  const featuredEvents = allEvents.filter((event) =>
    featuredIds.includes(event.id),
  );

  const topPickEvents = allEvents.filter((event) =>
    topPickIds.includes(event.id),
  );

  featuredContainer.innerHTML = featuredEvents.map(createEventCard).join("");

  topPicksContainer.innerHTML = topPickEvents.map(createEventCard).join("");
}

loadHomeEvents();

let started = false;
const startCounting = () => {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000;
    const increment = target / (duration / 16);

    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    updateCounter();
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        startCounting();
        started = false;
      }
    });
  },
  {
    threshold: 0.4,
  },
);

observer.observe(document.querySelector(".about-us"));
