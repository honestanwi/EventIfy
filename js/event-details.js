const params = new URLSearchParams(window.location.search);

const eventId = Number(params.get("id"));

const eventImage = document.getElementById("event-image");
const eventCategory = document.getElementById("event-category");
const eventTitle = document.getElementById("event-title");
const eventDate = document.getElementById("event-date");
const eventTime = document.getElementById("event-time");
const eventLocation = document.getElementById("event-location");
const eventDescription = document.getElementById("event-description");
const eventHighlights = document.getElementById("event-highlights");
const eventOrganizer = document.getElementById("event-organizer");
const similarEvents = document.getElementById("similar-events");

fetch("../js/json/event.json")
  .then((response) => response.json())
  .then((events) => {
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      document.querySelector(".event-details").innerHTML = `
        <h1>Event not found</h1>
        <a href="./events.html">Back to events</a>
      `;

      return;
    }

    displayEvent(event);
    renderSimilarEvents(event, events);
  })
  .catch((error) => {
    console.error("Error loading events:", error);
    // document.querySelector(".event-details").innerHTML =
    //   `<h1>Something went wrong loading this event.</h1>`;
  });

function displayEvent(event) {
  eventImage.src = event.image;
  eventImage.alt = event.title;

  eventCategory.textContent = event.category;
  eventTitle.textContent = event.title;

  eventDate.textContent = formatDate(event.date);
  eventTime.textContent = event.time;

  eventLocation.textContent = `${event.venue}, ${event.location}`;

  eventDescription.textContent = event.description;

  eventOrganizer.textContent = event.organizer;

  event.highlights.forEach((highlight) => {
    const li = document.createElement("li");

    li.textContent = highlight;

    eventHighlights.appendChild(li);
  });
  renderTicketTypes(event);
}
function renderTicketTypes(event) {
  const grid = document.getElementById("ticket-types-grid");

  grid.innerHTML = event.ticketTypes
    .map((ticket, i) => {
      const isVip = i === event.ticketTypes.length - 1;
      return `
      <div class="ticket-type-card ${isVip ? "featured" : ""}">
        <h3 class="ticket-type-name">${ticket.name}</h3>
        <p class="ticket-type-price">
          <span class="amount">${ticket.price.toLocaleString()}</span>
          <small>${event.currency}</small>
        </p>
        <ul class="ticket-type-benefits">
          ${ticket.benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <button class="ticket-select-btn">Select ${ticket.name}</button>
      </div>
    `;
    })
    .join("");
}

function formatDate(date) {
  const dateObject = new Date(date);

  return dateObject.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getSimilarEvents(event, allEvents, limit = 6) {
  return allEvents
    .filter((e) => e.category === event.category && e.id !== event.id)
    .slice(0, limit);
}

function renderSimilarEvents(event, allEvents) {
  const container = document.getElementById("similar-events");
  const similarEvents = getSimilarEvents(event, allEvents);

  if (similarEvents.length === 0) {
    container.innerHTML = `<p class="event-error">No similar events found.</p>`;
    return;
  }

  const row1 = similarEvents.slice(0, 3);
  const row2 = similarEvents.slice(3, 6);

  container.innerHTML = `
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

function createEventCard(event) {
  const price =
    event.price === 0 ? "Free" : `${event.price.toLocaleString()} XAF`;
  const eventDate = new Date(`${event.date}T00:00:00`);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
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
  // cards.addEventListener("click", () => {
  //   window.location.href = `event-details.html?id=${event.id}`;
  // });
}

// function displayEvents(events, container, heading) {
//   const row1 = events.slice(0, 3);
//   const row2 = events.slice(3, 6);

//   container.innerHTML = `
//     <h2 class="event-section-title">${heading}</h2>

//     <div class="event-grid">
//       <div class="event-row">
//         ${row1.map(createEventCard).join("")}
//       </div>

//       ${
//         row2.length > 0
//           ? `
//             <div class="event-row">
//               ${row2.map(createEventCard).join("")}
//             </div>
//           `
//           : ""
//       }
//     </div>
//   `;
// }

// async function loadEvents() {
//   try {
//     const response = await fetch("../js/json/similar-events.json");

//     if (!response.ok) {
//       throw new Error("Could not load events.");
//     }

//     const events = await response.json();
//     const artEvents = events.filter((event) => event.category === "Arts");
//     const concertEvents = events.filter(
//       (event) => event.category === "Concert",
//     );
//     const sportEvents = events.filter((event) => event.category === "Sports");
//     const techEvents = events.filter((event) => event.category === "Tech");
//     const conferenceEvents = events.filter(
//       (event) => event.category === "Conference",
//     );

//     displayEvents(artEvents, artCards, "Art events");
//     displayEvents(concertEvents, concertCards, "Concerts");
//     displayEvents(sportEvents, sportCards, "Sports");
//     displayEvents(techEvents, techCards, "Tech events");
//     displayEvents(conferenceEvents, conferenceCards, "Level up conferences");
//   } catch (error) {
//     artCards.innerHTML = `<p class="event-error">${error.message}</p>`;
//     concertCards.innerHTML = "";
//   }
// }

// loadEvents();
