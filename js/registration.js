// registration.js
// Captures the purchaser's details on submit. If the booking covers more
// than one attendee, additional name-only fields are generated dynamically
// (one ticket = one name; contact info and payment stay with the
// purchaser). Ticket count and event context currently come from the URL,
// e.g.:
//   registration.html?tickets=3&eventType=tech&eventName=DevCon+2026&amount=79.99
// Once the booking page exists, it should link here with those same params
// (quantity selected there becomes `tickets`).

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const formError = document.getElementById("formError");
  const extraAttendeesEl = document.getElementById("extraAttendees");
  const params = new URLSearchParams(window.location.search);

  const ticketCount = Math.max(1, parseInt(params.get("tickets"), 10) || 1);

  // Build one extra name field per additional ticket. The first
  // attendee's name is already covered by the "Your Name" field above.
  if (ticketCount > 1) {
    const note = document.createElement("p");
    note.className = "extra-attendees-note";
    note.textContent = `This booking includes ${ticketCount} tickets. Enter a name for each additional attendee below — one ticket will be issued per name.`;
    extraAttendeesEl.parentElement.insertBefore(note, extraAttendeesEl);

    for (let i = 2; i <= ticketCount; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "extra-attendee-input";
      input.dataset.attendeeIndex = String(i);
      input.placeholder = `Attendee ${i} Name`;
      input.required = true;
      extraAttendeesEl.appendChild(input);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    const extraInputs = Array.from(
      extraAttendeesEl.querySelectorAll(".extra-attendee-input"),
    );
    const extraNames = extraInputs.map((input) => input.value.trim());

    const allFilled =
      fullName && email && phone && address && extraNames.every(Boolean);

    if (!allFilled) {
      if (formError) formError.hidden = false;
      return;
    }
    if (formError) formError.hidden = true;

    const referenceNumber =
      "EVT-" + Math.floor(100000000 + Math.random() * 900000000);

    const attendeeNames = [fullName, ...extraNames];
    const tickets = attendeeNames.map((attendeeName, i) => ({
      attendeeName,
      ticketRef: `${referenceNumber}-${i + 1}`,
    }));

    const registration = {
      purchaser: { fullName, email, phone, address },

      // event context (from URL params once the event/booking pages pass
      // them along; falls back to demo values for now)
      eventType: (params.get("eventType") || "conference").toLowerCase(),
      eventName: params.get("eventName") || "Eventify Summit 2026",
      eventDate: params.get("eventDate") || "Sep 12, 2026 · 10:00 AM",
      eventVenue: params.get("eventVenue") || "Main Convention Hall, Lagos",
      ticketTier: params.get("ticketTier") || "Standard",

      // payment (from URL params once the booking page passes them along)
      amount: params.get("amount") || "49.99",
      paymentMethod: params.get("paymentMethod") || "Credit Card",
      paymentStatus: "Success",

      referenceNumber,
      submittedAt: new Date().toISOString(),
      tickets,
    };

    localStorage.setItem("eventifyRegistration", JSON.stringify(registration));
    window.location.href = "confirmation.html";
  });
});
