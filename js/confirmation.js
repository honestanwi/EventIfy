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

  if (!data || !Array.isArray(data.tickets) || data.tickets.length === 0) {
    content.hidden = true;
    emptyState.hidden = false;
    return;
  }

  const $ = (id) => document.getElementById(id);

  // --- intro text ---------------------------------------------------
  $("summaryText").textContent =
    `Thanks, ${data.purchaser.fullName}! A confirmation has been sent to ` +
    `${data.purchaser.email}. ${data.tickets.length > 1 ? "Your tickets are" : "Your ticket is"} ready below.`;

  // --- receipt: purchaser + payment (shared across all tickets) -----
  $("ticketAttendeeName").textContent = data.purchaser.fullName;
  $("ticketAttendeeEmail").textContent = data.purchaser.email;
  $("ticketAttendeePhone").textContent = data.purchaser.phone;
  $("ticketAttendeeAddress").textContent = data.purchaser.address;

  $("amountDisplay").textContent = `$${data.amount}`;
  $("amountRow").textContent = `$${data.amount}`;
  $("paymentDate").textContent = new Date(data.submittedAt).toLocaleString();
  $("referenceNumber").textContent = data.referenceNumber;
  $("ticketCountRow").textContent =
    `${data.tickets.length} × ${data.ticketTier}`;
  $("paymentMethod").textContent = data.paymentMethod;
  $("paymentStatus").textContent = data.paymentStatus;

  const receiptCard = $("receiptCard");
  receiptCard.classList.add(`ticket-${data.eventType}`);
  $("categoryBadge").textContent =
    data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1);

  // --- tickets: one stub per attendee --------------------------------
  const template = $("ticketStubTemplate");
  const container = $("ticketsContainer");
  const stubEls = [];

  data.tickets.forEach((ticket) => {
    const node = template.content.cloneNode(true);
    const stub = node.querySelector(".ticket-stub");

    stub.classList.add(`ticket-${data.eventType}`);
    stub.querySelector('[data-field="eventName"]').textContent = data.eventName;
    stub.querySelector('[data-field="eventDate"]').textContent = data.eventDate;
    stub.querySelector('[data-field="eventVenue"]').textContent =
      data.eventVenue;
    stub.querySelector('[data-field="attendeeName"]').textContent =
      ticket.attendeeName;
    stub.querySelector('[data-field="ticketTier"]').textContent =
      data.ticketTier;
    stub.querySelector('[data-field="ticketRef"]').textContent =
      ticket.ticketRef;

    // QR encodes enough for a scanner to verify this specific ticket
    const qrPayload = encodeURIComponent(
      JSON.stringify({
        ref: ticket.ticketRef,
        name: ticket.attendeeName,
        event: data.eventName,
        tier: data.ticketTier,
      }),
    );
    const qrImg = stub.querySelector('[data-field="qrCode"]');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrPayload}`;

    const downloadBtn = stub.querySelector('[data-action="download"]');
    downloadBtn.addEventListener("click", () =>
      downloadStub(stub, ticket.ticketRef),
    );

    container.appendChild(node);
    stubEls.push(stub);
  });

  $("downloadAllBtn").addEventListener("click", () => {
    stubEls.forEach((stub, i) => {
      setTimeout(() => downloadStub(stub, data.tickets[i].ticketRef), i * 400);
    });
  });

  function downloadStub(stub, ref) {
    if (typeof html2canvas === "undefined") {
      window.print();
      return;
    }
    html2canvas(stub, { backgroundColor: "#ffffff", scale: 2 }).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = `${ref}-ticket.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      },
    );
  }
});
