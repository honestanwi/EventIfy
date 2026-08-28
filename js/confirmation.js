// confirmation.js
// Reads the registration saved by registration.js: one purchaser/payment
// record plus an array of tickets (one per attendee). Renders the receipt
// once, and clones a ticket-stub per attendee — each with its own QR code
// and download button, plus a "download all" option.

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(
    localStorage.getItem("eventifyRegistration") || "null",
  );

  const content = document.getElementById("confirmationContent");

  const emptyState = document.getElementById("emptyState");

  if (!data || !Array.isArray(data.events) || data.events.length === 0) {
    content.hidden = true;

    emptyState.hidden = false;

    return;
  }

  const summaryText = document.getElementById("summaryText");

  summaryText.textContent = `Thanks, ${data.purchaser.fullName}! Your booking has been confirmed. ${data.ticketCount} ticket${data.ticketCount === 1 ? "" : "s"} have been issued.`;

  /*
    We no longer use the old single receipt.
    Instead we generate one receipt for every event.
  */

  const oldReceipt = document.getElementById("receiptCard");

  if (oldReceipt) {
    oldReceipt.remove();
  }

  const confirmRight = document.querySelector(".confirm-right");

  const receiptHeading = document.createElement("div");

  receiptHeading.className = "confirmation-receipts-heading";

  receiptHeading.innerHTML = `
    <span>PAYMENT RECEIPTS</span>
    <h2>Your booking details</h2>
  `;

  confirmRight.prepend(receiptHeading);

  const receiptsContainer = document.createElement("div");

  receiptsContainer.id = "receiptsContainer";

  receiptsContainer.className = "receipts-container";

  confirmRight.appendChild(receiptsContainer);

  /*
    One receipt per event.
  */

  data.events.forEach((event, eventIndex) => {
    const receipt = document.createElement("article");

    receipt.className = "receipt-card dynamic-receipt";

    const attendeeList = event.attendees
      .map(
        (attendee, index) => `
              <div class="receipt-attendee">

                <div>
                  <span>Attendee ${index + 1}</span>

                  <strong>
                    ${attendee.attendeeName}
                  </strong>
                </div>

                <div>
                  <small>
                    ${attendee.attendeeEmail}
                  </small>

                  <small>
                    ${attendee.attendeePhone}
                  </small>
                </div>

              </div>
            `,
      )
      .join("");

    receipt.innerHTML = `

        <span class="category-badge">
          ${event.eventType}
        </span>


        <div class="receipt-event-header">

          <div>

            <h2>
              ${event.eventName}
            </h2>

            <p>
              ${event.eventDate}
              ·
              ${event.eventTime}
            </p>

            <p>
              📍 ${event.eventVenue},
              ${event.eventLocation}
            </p>

          </div>

        </div>


        <div class="ticket-amount-row">

          <div>

            <div class="ticket-amount">
              ${Number(event.total).toLocaleString()}
              ${event.currency}
            </div>

            <div class="ticket-amount-label">
              Payment success!
            </div>

          </div>

          <div class="ticket-check">
            ✓
          </div>

        </div>


        <div class="ticket-divider"></div>


        <div class="ticket-section">

          <h3>Ticket details</h3>


          <div class="ticket-row">

            <span>Ticket type</span>

            <span>
              ${event.ticketTier}
            </span>

          </div>


          <div class="ticket-row">

            <span>Number of tickets</span>

            <span>
              ${event.quantity}
            </span>

          </div>


          <div class="ticket-row">

            <span>Price per ticket</span>

            <span>
              ${Number(event.unitPrice).toLocaleString()}
              ${event.currency}
            </span>

          </div>


          <div class="ticket-row">

            <span>Event total</span>

            <strong>
              ${Number(event.total).toLocaleString()}
              ${event.currency}
            </strong>

          </div>

        </div>


        <div class="ticket-section">

          <h3>Attendees</h3>

          <div class="receipt-attendees">

            ${attendeeList}

          </div>

        </div>


        <div class="ticket-section">

          <h3>Payment details</h3>


          <div class="ticket-row">

            <span>Payment method</span>

            <span>
              ${data.paymentMethod}
            </span>

          </div>


          <div class="ticket-row">

            <span>Reference</span>

            <span>
              ${data.referenceNumber}-${eventIndex + 1}
            </span>

          </div>


          <div class="ticket-row">

            <span>Status</span>

            <span class="status-success">
              ${data.paymentStatus}
            </span>

          </div>


          <div class="ticket-row">

            <span>Date</span>

            <span>
              ${new Date(data.submittedAt).toLocaleString()}
            </span>

          </div>

        </div>

      `;

    receiptsContainer.appendChild(receipt);
  });

  /*
    Ticket stubs
    One ticket = one attendee.
  */

  const ticketsContainer = document.getElementById("ticketsContainer");

  const template = document.getElementById("ticketStubTemplate");

  const allTicketElements = [];

  data.events.forEach((event) => {
    event.attendees.forEach((attendee) => {
      const node = template.content.cloneNode(true);

      const stub = node.querySelector(".ticket-stub");

      stub.querySelector('[data-field="eventName"]').textContent =
        event.eventName;

      stub.querySelector('[data-field="eventDate"]').textContent =
        `${event.eventDate} · ${event.eventTime}`;

      stub.querySelector('[data-field="eventVenue"]').textContent =
        `${event.eventVenue}, ${event.eventLocation}`;

      stub.querySelector('[data-field="attendeeName"]').textContent =
        attendee.attendeeName;

      stub.querySelector('[data-field="ticketTier"]').textContent =
        event.ticketTier;

      stub.querySelector('[data-field="ticketRef"]').textContent =
        attendee.ticketRef;

      const qrPayload = encodeURIComponent(
        JSON.stringify({
          ref: attendee.ticketRef,

          name: attendee.attendeeName,

          event: event.eventName,

          tier: event.ticketTier,
        }),
      );

      const qr = stub.querySelector('[data-field="qrCode"]');

      qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrPayload}`;

      const downloadButton = stub.querySelector('[data-action="download"]');

      downloadButton.addEventListener("click", () =>
        downloadStub(stub, attendee.ticketRef),
      );

      ticketsContainer.appendChild(node);

      allTicketElements.push({
        element: stub,
        ref: attendee.ticketRef,
      });
    });
  });

  const downloadAll = document.getElementById("downloadAllBtn");

  downloadAll.addEventListener("click", () => {
    allTicketElements.forEach((ticket, index) => {
      setTimeout(() => {
        downloadStub(ticket.element, ticket.ref);
      }, index * 400);
    });
  });

  function downloadStub(stub, reference) {
    if (typeof html2canvas === "undefined") {
      window.print();

      return;
    }

    html2canvas(stub, {
      backgroundColor: "#ffffff",
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");

      link.download = `${reference}-ticket.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();
    });
  }
});
