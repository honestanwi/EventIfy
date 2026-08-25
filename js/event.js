const artCards = document.getElementById("art-cards");
const concertCards = document.getElementById("concert-cards");
const sportCards = document.getElementById("sport-cards");
const techCards = document.getElementById("tech-cards");
const conferenceCards = document.getElementById("conference-cards");

function createEventCard(event) {
  const price =
    event.price === 0 ? "Free" : `${event.price.toLocaleString()} XAF`;
  const eventDate = new Date(`${event.date}T00:00:00`);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const day = eventDate.getDate();

  return `
    <article class="event-card">
      <div class="event-card-content">
        <time class="event-date" datetime="${event.date}">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
          <span class="event-yr">2025</span>
          <span class="event-time">${event.time}</span>
        </time>
        <p class="event-category">${event.category}</p>
        <h3 class="event-title">${event.title}</h3>
        <p class="event-location">${event.venue}, ${event.location}</p>
        <div class="event-actions">
          <a class="event-details-button" href="event-detail.html?id=${event.id}">View details</a>
        </div>
      </div>
      <div class="event-card-media">
        <img class="event-image" src="${event.image}" alt="${event.title}" loading="lazy" />
      </div>
    </article>
  `;
}

function displayEvents(events, container, heading) {
  const row1 = events.slice(0, 4);
  const row2 = events.slice(4, 8);

  container.innerHTML = `
    <h2 class="event-section-title">${heading}</h2>

    <div class="event-grid">
      <div class="event-row">
        ${row1.map(createEventCard).join("")}
      </div>

      ${
        row2.length > 0
          ? `
            <div class="event-row">
              ${row2.map(createEventCard).join("")}
            </div>
          `
          : ""
      }
    </div>
  `;
}

async function loadEvents() {
  try {
    const response = await fetch("../js/json/event.json");

    if (!response.ok) {
      throw new Error("Could not load events.");
    }

    const events = await response.json();
    const artEvents = events.filter((event) => event.category === "Arts");
    const concertEvents = events.filter(
      (event) => event.category === "Concert",
    );
    const sportEvents = events.filter((event) => event.category === "Sports");
    const techEvents = events.filter((event) => event.category === "Tech");
    const conferenceEvents = events.filter(
      (event) => event.category === "Conference",
    );

    displayEvents(artEvents, artCards, "Art events");
    displayEvents(concertEvents, concertCards, "Concerts");
    displayEvents(sportEvents, sportCards, "Sports");
    displayEvents(techEvents, techCards, "Tech events");
    displayEvents(conferenceEvents, conferenceCards, "Level up conferences");
  } catch (error) {
    artCards.innerHTML = `<p class="event-error">${error.message}</p>`;
    concertCards.innerHTML = "";
  }
}

loadEvents();
