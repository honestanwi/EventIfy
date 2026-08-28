document.addEventListener("DOMContentLoaded", () => {
  const bookingItems = document.getElementById("booking-items");
  const paymentSummary = document.getElementById("payment-summary");
  const grandTotal = document.getElementById("grand-total");
  const ticketCountText = document.getElementById("ticket-count-text");
  const confirmPayment = document.getElementById("confirm-payment");
  const paymentError = document.getElementById("payment-error");

  let cart = JSON.parse(localStorage.getItem("eventifyCart") || "[]");

  function saveCart() {
    localStorage.setItem("eventifyCart", JSON.stringify(cart));
  }

  function formatMoney(amount, currency = "XAF") {
    return `${Number(amount).toLocaleString()} ${currency}`;
  }

  function getTotalTickets() {
    return cart.reduce((total, item) => total + Number(item.quantity), 0);
  }

  function getGrandTotal() {
    return cart.reduce(
      (total, item) => total + Number(item.unitPrice) * Number(item.quantity),
      0,
    );
  }

  function render() {
    if (!cart.length) {
      bookingItems.innerHTML = `
        <div class="empty-booking">

          <h2>Your booking is empty</h2>

          <p>
            You haven't selected any tickets yet.
          </p>

          <a href="event.html">
            Explore events
          </a>

        </div>
      `;

      paymentSummary.innerHTML = "";

      grandTotal.textContent = "0 XAF";

      ticketCountText.textContent = "0 tickets";

      confirmPayment.disabled = true;

      return;
    }

    confirmPayment.disabled = false;

    const ticketCount = getTotalTickets();

    ticketCountText.textContent = `${ticketCount} ${ticketCount === 1 ? "ticket" : "tickets"}`;

    /* ==========================
       LEFT SIDE
    ========================== */

    bookingItems.innerHTML = cart
      .map((item, index) => {
        const itemTotal = Number(item.unitPrice) * Number(item.quantity);

        return `
          <article class="booking-item">

            <button
              class="remove-ticket"
              data-remove="${index}"
              aria-label="Remove ticket"
              title="Remove"
            >
              ×
            </button>

            <div class="booking-item-image">
              <img
                src="${item.eventImage}"
                alt="${item.eventName}"
              />
            </div>

            <div class="booking-item-content">

              <p class="booking-item-event">
                ${item.eventType}
              </p>

              <h3>
                ${item.eventName}
              </h3>

              <span class="booking-item-tier">
                ${item.ticketTier}
              </span>

              <p class="booking-item-event">
                ${item.eventDate} · ${item.eventTime}
              </p>

              <div class="booking-item-bottom">

                <div class="booking-item-price">

                  ${formatMoney(itemTotal, item.currency)}

                  <small>
                    ${formatMoney(item.unitPrice, item.currency)}
                    each
                  </small>

                </div>


                <div class="quantity-control">

                  <button
                    class="quantity-btn"
                    data-action="decrease"
                    data-index="${index}"
                  >
                    −
                  </button>

                  <span class="quantity-value">
                    ${item.quantity}
                  </span>

                  <button
                    class="quantity-btn"
                    data-action="increase"
                    data-index="${index}"
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          </article>
        `;
      })
      .join("");

    /* ==========================
       RIGHT SIDE
    ========================== */

    paymentSummary.innerHTML = cart
      .map((item) => {
        const total = Number(item.unitPrice) * Number(item.quantity);

        return `
          <div class="summary-item">

            <div>

              <div class="summary-event">
                ${item.eventName}
              </div>

              <div class="summary-ticket">
                ${item.ticketTier}
              </div>

              <div class="summary-quantity">
                ${item.quantity} ×
                ${formatMoney(item.unitPrice, item.currency)}
              </div>

            </div>

            <div class="summary-price">
              ${formatMoney(total, item.currency)}
            </div>

          </div>
        `;
      })
      .join("");

    grandTotal.textContent = formatMoney(
      getGrandTotal(),
      cart[0]?.currency || "XAF",
    );

    attachEvents();
  }

  function attachEvents() {
    document.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.remove);

        cart.splice(index, 1);

        saveCart();

        render();
      });
    });

    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (action === "increase") {
          cart[index].quantity += 1;
        }

        if (action === "decrease") {
          cart[index].quantity -= 1;

          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }
        }

        saveCart();

        render();
      });
    });
  }

  /* ==========================
     CONFIRM PAYMENT
  ========================== */

  confirmPayment.addEventListener("click", () => {
    const selectedPayment = document.querySelector(
      'input[name="paymentMethod"]:checked',
    );

    if (!selectedPayment) {
      paymentError.hidden = false;

      return;
    }

    paymentError.hidden = true;

    const paymentData = {
      method: selectedPayment.value,

      total: getGrandTotal(),

      ticketCount: getTotalTickets(),

      cart: cart.map((item) => ({
        ...item,
      })),

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("eventifyPendingBooking", JSON.stringify(paymentData));

    window.location.href = "registration.html";
  });

  render();
});
