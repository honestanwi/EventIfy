document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  if (!form) return;

  const formError = document.getElementById("formError");

  const extraAttendeesEl = document.getElementById("extraAttendees");

  const pendingBooking = JSON.parse(
    localStorage.getItem("eventifyPendingBooking") || "null",
  );

  if (
    !pendingBooking ||
    !Array.isArray(pendingBooking.cart) ||
    pendingBooking.cart.length === 0
  ) {
    window.location.href = "booking.html";

    return;
  }

  const cart = pendingBooking.cart;

  const attendeeTickets = [];

  cart.forEach((item, eventIndex) => {
    for (let i = 0; i < item.quantity; i++) {
      attendeeTickets.push({
        eventIndex,
        eventName: item.eventName,
        ticketTier: item.ticketTier,
        unitPrice: item.unitPrice,
      });
    }
  });

  const note = document.createElement("p");

  note.className = "extra-attendees-note";

  note.textContent = `Your booking contains ${attendeeTickets.length} ticket${attendeeTickets.length === 1 ? "" : "s"}. Enter the details for each attendee.`;

  extraAttendeesEl.parentElement.insertBefore(note, extraAttendeesEl);

  attendeeTickets.forEach((ticket, index) => {
    const wrapper = document.createElement("div");

    wrapper.className = "attendee-registration";

    wrapper.innerHTML = `

      <div class="attendee-registration-header">

        <span>
          Attendee ${index + 1} ·
        </span>

        <small>
          ${ticket.eventName}
          ·
          ${ticket.ticketTier}
        </small>

      </div>

<div class="input-group">
      <input
        type="text"
        class="attendee-input"
        data-attendee-index="${index}"
        placeholder="Full name"
        required
      />


      <input
        type="email"
        class="attendee-input"
        data-attendee-index="${index}"
        placeholder="Email address"
        required
      />


      <input
        type="tel"
        class="attendee-input"
        data-attendee-index="${index}"
        placeholder="Phone number"
        required
      /> </div>

    `;

    extraAttendeesEl.appendChild(wrapper);
  });

  /* ======================================
     SUBMIT
  ====================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const purchaser = {
      fullName: document.getElementById("fullName").value.trim(),

      email: document.getElementById("email").value.trim(),

      phone: document.getElementById("phone").value.trim(),

      address: document.getElementById("address").value.trim(),
    };

    const attendeeWrappers = Array.from(
      document.querySelectorAll(".attendee-registration"),
    );

    const attendees = attendeeWrappers.map((wrapper, index) => {
      const inputs = wrapper.querySelectorAll(".attendee-input");

      return {
        attendeeName: inputs[0].value.trim(),

        attendeeEmail: inputs[1].value.trim(),

        attendeePhone: inputs[2].value.trim(),

        eventIndex: attendeeTickets[index].eventIndex,

        eventName: attendeeTickets[index].eventName,

        ticketTier: attendeeTickets[index].ticketTier,
      };
    });

    const everythingFilled =
      purchaser.fullName &&
      purchaser.email &&
      purchaser.phone &&
      purchaser.address &&
      attendees.every(
        (attendee) =>
          attendee.attendeeName &&
          attendee.attendeeEmail &&
          attendee.attendeePhone,
      );

    if (!everythingFilled) {
      formError.hidden = false;

      return;
    }

    formError.hidden = true;

    const referenceNumber =
      "EVT-" + Math.floor(100000000 + Math.random() * 900000000);

    /*
      Create individual ticket references.
    */

    attendees.forEach((attendee, index) => {
      attendee.ticketRef = `${referenceNumber}-${String(index + 1).padStart(2, "0")}`;
    });

    /*
      Group attendee records back into events.
    */

    const events = cart.map((eventItem, eventIndex) => {
      const eventAttendees = attendees.filter(
        (attendee) => attendee.eventIndex === eventIndex,
      );

      const eventTotal = eventItem.unitPrice * eventItem.quantity;

      return {
        eventId: eventItem.eventId,

        eventName: eventItem.eventName,

        eventType: eventItem.eventType,

        eventDate: eventItem.eventDate,

        eventTime: eventItem.eventTime,

        eventVenue: eventItem.eventVenue,

        eventLocation: eventItem.eventLocation,

        eventImage: eventItem.eventImage,

        ticketTier: eventItem.ticketTier,

        unitPrice: eventItem.unitPrice,

        quantity: eventItem.quantity,

        total: eventTotal,

        currency: eventItem.currency,

        attendees: eventAttendees,
      };
    });

    const registration = {
      purchaser,

      events,

      total: pendingBooking.total,

      ticketCount: pendingBooking.ticketCount,

      paymentMethod: pendingBooking.method,

      paymentStatus: "Success",

      referenceNumber,

      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("eventifyRegistration", JSON.stringify(registration));

    /*
      Booking has now been completed.
      Clear the temporary cart.
    */

    localStorage.removeItem("eventifyCart");

    localStorage.removeItem("eventifyPendingBooking");

    window.location.href = "confirmation.html";
  });
});
