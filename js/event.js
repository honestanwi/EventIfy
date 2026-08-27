const artCards = document.getElementById("art-cards");
const concertCards = document.getElementById("concert-cards");
const sportCards = document.getElementById("sport-cards");
const techCards = document.getElementById("tech-cards");
const conferenceCards = document.getElementById("conference-cards");
const cards = document.querySelector(".cards");
const searchInput = document.querySelector(".search-bar input");
const cityFilter = document.getElementById("city-filter");
const dateFilter = document.getElementById("date-filter");
const searchButton = document.querySelector(".search-bar .btn");

const categoryButtons = document.querySelectorAll(".cat-pill");
const noResult = document.getElementById("no-results");

let allEvents = [];
let selectedCategory = "All";

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

function displayEvents(events, container, heading, showHeading = true) {
  // If there are no events, completely clear the container
  if (events.length === 0) {
    container.innerHTML = "";
    return;
  }

  const row1 = events.slice(0, 4);
  const row2 = events.slice(4, 8);

  container.innerHTML = `
    ${showHeading ? `<h2 class="event-section-title">${heading}</h2>` : ""}

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

    allEvents = await response.json();

    // Create the date options
    createDateOptions();

    // Show all events initially
    filterAndDisplayEvents();
  } catch (error) {
    artCards.innerHTML = `<p class="event-error">${error.message}</p>`;
    concertCards.innerHTML = "";
    sportCards.innerHTML = "";
    techCards.innerHTML = "";
    conferenceCards.innerHTML = "";
  }
}

if (artCards) {
  loadEvents();
}
function filterAndDisplayEvents() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCity = cityFilter.value;
  const selectedDate = dateFilter.value;

  const filteredEvents = allEvents.filter((event) => {
    //
    // Search through title, category, venue and city
    const matchesSearch =
      event.title.toLowerCase().includes(searchValue) ||
      event.category.toLowerCase().includes(searchValue) ||
      event.venue.toLowerCase().includes(searchValue) ||
      event.location.toLowerCase().includes(searchValue);

    // City filter
    const matchesCity =
      selectedCity === "Any city" || event.location === selectedCity;

    // Date filter
    const matchesDate =
      selectedDate === "Any Date" || event.date === selectedDate;

    // Category filter
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCity && matchesDate && matchesCategory;
  });
  if (filteredEvents.length === 0) {
    noResult.innerHTML = `
      <div class="no-results">
        <h2>No events found 😕</h2>
        <p>
          We couldn't find anything matching your search.
          Try another keyword or change your filters.
        </p>
      </div>
    `;

    concertCards.innerHTML = "";
    sportCards.innerHTML = "";
    techCards.innerHTML = "";
    conferenceCards.innerHTML = "";

    return;
  }

  // Separate filtered events by category
  const artEvents = filteredEvents.filter((event) => event.category === "Arts");

  const concertEvents = filteredEvents.filter(
    (event) => event.category === "Concert",
  );

  const sportEvents = filteredEvents.filter(
    (event) => event.category === "Sports",
  );

  const techEvents = filteredEvents.filter(
    (event) => event.category === "Tech",
  );

  const conferenceEvents = filteredEvents.filter(
    (event) => event.category === "Conference",
  );

  // Display the filtered results
  const isFiltering =
    searchInput.value.trim() !== "" ||
    cityFilter.value !== "Any city" ||
    dateFilter.value !== "Any Date" ||
    selectedCategory !== "All";

  if (isFiltering) {
    displayEvents(artEvents, artCards, "", false);
    displayEvents(concertEvents, concertCards, "", false);
    displayEvents(sportEvents, sportCards, "", false);
    displayEvents(techEvents, techCards, "", false);
    displayEvents(conferenceEvents, conferenceCards, "", false);
  } else {
    displayEvents(artEvents, artCards, "Art events");
    displayEvents(concertEvents, concertCards, "Concerts");
    displayEvents(sportEvents, sportCards, "Sports");
    displayEvents(techEvents, techCards, "Tech events");
    displayEvents(conferenceEvents, conferenceCards, "Level up conferences");
  }

  // Hide sections that aren't part of the selected category
  updateCategorySections();
}
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active from all buttons
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Activate clicked button
    button.classList.add("active");

    const category = button.textContent.trim();

    // Your JSON calls Music "Concert"
    if (category === "Music") {
      selectedCategory = "Concert";
    } else {
      selectedCategory = category;
    }

    filterAndDisplayEvents();
  });
});
function updateCategorySections() {
  const sections = [
    {
      container: artCards,
      category: "Arts",
    },
    {
      container: concertCards,
      category: "Concert",
    },
    {
      container: sportCards,
      category: "Sports",
    },
    {
      container: techCards,
      category: "Tech",
    },
    {
      container: conferenceCards,
      category: "Conference",
    },
  ];

  sections.forEach((section) => {
    const sectionElement = section.container.closest(".section");

    if (!sectionElement) return;

    if (selectedCategory === "All" || selectedCategory === section.category) {
      sectionElement.style.display = "";
    } else {
      sectionElement.style.display = "none";
    }
  });
}
searchInput.addEventListener("input", () => {
  filterAndDisplayEvents();
});
cityFilter.addEventListener("change", () => {
  filterAndDisplayEvents();
});
function createDateOptions() {
  // Get unique dates
  const dates = [...new Set(allEvents.map((event) => event.date))];

  dates.sort();

  dates.forEach((date) => {
    const option = document.createElement("option");

    option.value = date;
    option.textContent = formatDate(date);

    dateFilter.appendChild(option);
  });
}
function formatDate(date) {
  const eventDate = new Date(`${date}T00:00:00`);

  return eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  filterAndDisplayEvents();
});
