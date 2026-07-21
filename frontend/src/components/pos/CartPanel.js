import { createOrder, addOrderItem, saveDraft } from "../../store/posData.js";

let cartItems = [];

function CartPanel() {
  const subtotal = cartItems.reduce(function (s, i) {
    return s + i.price * i.qty;
  }, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  let html =
    '<div class="pos-cart bg-white border border-brand-300 rounded-xl shadow-sm p-5 h-full flex flex-col">';
  html += '<div class="flex items-center justify-between mb-4">';
  html += '<h3 class="text-base font-semibold text-primary-700 font-display">Current Order</h3>';
  html +=
    '<span id="cart-count" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold">' +
    cartItems.length +
    "</span>";
  html += "</div>";

  html += '<div id="cart-items" class="flex-1 overflow-y-auto space-y-3 min-h-[200px]">';
  if (cartItems.length === 0) {
    html += '<p class="text-sm text-brand-400 italic text-center py-8">No items added yet</p>';
  } else {
    cartItems.forEach(function (item, idx) {
      html += '<div class="flex items-center gap-3 p-3 bg-brand-50 rounded-lg">';
      html += '<span class="text-xl">' + (item.emoji || "\uD83C\uDF7D\uFE0F") + "</span>";
      html += '<div class="flex-1 min-w-0">';
      html += '<p class="text-sm font-semibold text-primary-800 truncate">' + item.name + "</p>";
      html += '<p class="text-xs text-brand-500 font-mono">$' + item.price.toFixed(2) + "</p>";
      html += "</div>";
      html += '<div class="flex items-center gap-1">';
      html +=
        '<button data-qty="-1" data-idx="' +
        idx +
        '" class="w-6 h-6 rounded bg-brand-200 hover:bg-brand-300 flex items-center justify-center text-xs font-bold border-0 cursor-pointer">-</button>';
      html += '<span class="w-6 text-center text-sm font-semibold">' + item.qty + "</span>";
      html +=
        '<button data-qty="1" data-idx="' +
        idx +
        '" class="w-6 h-6 rounded bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center text-xs font-bold border-0 cursor-pointer">+</button>';
      html += "</div>";
      html +=
        '<span class="text-sm font-semibold font-mono text-primary-700 w-16 text-right">$' +
        (item.price * item.qty).toFixed(2) +
        "</span>";
      html +=
        '<button data-remove-idx="' +
        idx +
        '" class="text-error-500 hover:text-error-700 bg-transparent border-0 cursor-pointer"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>';
      html += "</div>";
    });
  }
  html += "</div>";

  html += '<div class="border-t border-brand-200 pt-3 mt-3 space-y-2">';
  html +=
    '<div class="flex justify-between text-sm text-brand-600"><span>Subtotal</span><span class="font-mono">$' +
    subtotal.toFixed(2) +
    "</span></div>";
  html +=
    '<div class="flex justify-between text-sm text-brand-600"><span>Tax (10%)</span><span class="font-mono">$' +
    tax.toFixed(2) +
    "</span></div>";
  html +=
    '<div class="flex justify-between text-base font-bold text-primary-800"><span>Total</span><span class="font-mono">$' +
    total.toFixed(2) +
    "</span></div>";
  html += "</div>";

  html += '<div class="mt-3">';
  html +=
    '<textarea id="cart-kitchen-note" rows="2" placeholder="Kitchen note (allergy, substitution...)" class="w-full border border-brand-300 rounded-md p-2 text-xs text-neutral-700 resize-none focus:outline-none focus:border-brand-500"></textarea>';
  html += "</div>";

  html += '<div class="flex gap-2 mt-2">';
  html +=
    '<button id="cart-save-draft" class="flex-1 h-10 px-4 text-sm font-semibold rounded-md bg-transparent text-brand-600 hover:bg-brand-50 border border-brand-300 cursor-pointer transition-colors">Save Draft</button>';
  html +=
    '<button id="cart-send-kitchen" class="flex-1 h-10 px-4 text-sm font-semibold rounded-md bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors">Send to Kitchen</button>';
  html += "</div>";
  html += "</div>";

  return html;
}

function setupCartEvents() {
  document.addEventListener("click", function (e) {
    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      const idx = parseInt(qtyBtn.getAttribute("data-idx"));
      const delta = parseInt(qtyBtn.getAttribute("data-qty"));
      if (cartItems[idx]) {
        cartItems[idx].qty = Math.max(1, cartItems[idx].qty + delta);
        refreshCart();
      }
      return;
    }

    const removeBtn = e.target.closest("[data-remove-idx]");
    if (removeBtn) {
      const ridx = parseInt(removeBtn.getAttribute("data-remove-idx"));
      cartItems.splice(ridx, 1);
      refreshCart();
      return;
    }
  });

  window.addEventListener("cart:add", function (e) {
    const item = e.detail.item;
    const existing = cartItems.find(function (c) {
      return c.id === item.id;
    });
    if (existing) {
      existing.qty++;
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        emoji: item.emoji,
      });
    }
    refreshCart();
  });

  document.addEventListener("click", async function (e) {
    const sendBtn = e.target.closest("#cart-send-kitchen");
    if (sendBtn) {
      if (cartItems.length === 0) return;
      const tableSelect = document.getElementById("table-select");
      const tableId = tableSelect ? tableSelect.value : null;
      if (!tableId) {
        alert("Please select a table before sending to kitchen");
        return;
      }
      const noteInput = document.getElementById("cart-kitchen-note");
      const kitchenNote = noteInput ? noteInput.value.trim() : "";
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";
      try {
        const reservationId = window._pendingReservationId || null;
        window._pendingReservationId = null;
        const result = await createOrder(tableId, reservationId);
        if (result.success && result.order) {
          const orderId = result.order.id;
          for (const cartItem of cartItems) {
            await addOrderItem(orderId, cartItem.id, cartItem.qty, kitchenNote || undefined);
          }
          cartItems = [];
          refreshCart();
          window.dispatchEvent(new CustomEvent("cart:sent"));
        } else {
          alert("Failed to create order: " + (result.error || "Unknown error"));
          sendBtn.disabled = false;
          sendBtn.textContent = "Send to Kitchen";
        }
      } catch (err) {
        alert("Error sending to kitchen: " + err.message);
        sendBtn.disabled = false;
        sendBtn.textContent = "Send to Kitchen";
      }
      return;
    }

    if (e.target.closest("#cart-save-draft")) {
      if (cartItems.length === 0) return;
      const tableSelect = document.getElementById("table-select");
      const tableId = tableSelect ? tableSelect.value : null;
      saveDraft(cartItems, tableId);
      cartItems = [];
      refreshCart();
      return;
    }
  });
}

function refreshCart() {
  const container = document.querySelector(".pos-cart");
  if (!container) return;
  const parent = container.parentElement;
  if (!parent) return;
  parent.innerHTML = CartPanel();
  window.createIcons();
}

setupCartEvents();

export function loadDraftItems(draftItems) {
  cartItems = draftItems.map(function (d) {
    return { id: d.id, name: d.name, price: d.price, qty: d.qty, emoji: null };
  });
  refreshCart();
}

export default CartPanel;
