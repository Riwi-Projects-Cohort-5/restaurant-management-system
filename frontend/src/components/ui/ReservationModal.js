import { tables } from "../../store/posData.js";

class ReservationModal {
  constructor() {
    this._resolve = null;
    this._container = null;
  }

  show({ title = "New Reservation", preset = {} } = {}) {
    return new Promise((resolve) => {
      this._resolve = resolve;

      if (this._container) {
        this._container.remove();
      }

      const now = new Date();
      const dateDefault = preset.date || now.toISOString().split("T")[0];
      const timeDefault = preset.time || now.toTimeString().slice(0, 5);

      let tableOptions = '<option value="">-- Optional --</option>';
      tables.forEach(function (t) {
        const sel = preset.tableId === t.id ? " selected" : "";
        tableOptions +=
          '<option value="' + t.id + '"' + sel + ">Table " + t.number + " (" + t.seats + " seats)</option>";
      });

      this._container = document.createElement("div");
      this._container.innerHTML = `
        <div data-res-overlay class="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center">
          <div data-res-modal class="bg-white rounded-xl shadow-xl w-[420px] max-h-[90vh] flex flex-col animate-modal-in">
            <div class="flex items-center justify-between px-5 py-4 border-b border-brand-100">
              <h3 class="text-base font-bold text-brand-800">${title}</h3>
              <button data-res-close class="text-brand-400 hover:text-brand-600 bg-transparent border-0 cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="px-5 py-4 overflow-y-auto flex flex-col gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-guest">Guest Name *</label>
                  <input id="res-m-guest" type="text" value="${preset.guestName || ""}" placeholder="e.g. Juan Perez" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.1)]" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-phone">Phone</label>
                  <input id="res-m-phone" type="tel" value="${preset.guestPhone || ""}" placeholder="+52 55 1234 5678" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.1)]" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-date">Date *</label>
                  <input id="res-m-date" type="date" value="${dateDefault}" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-time">Time *</label>
                  <input id="res-m-time" type="time" value="${timeDefault}" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-party">Party Size *</label>
                  <input id="res-m-party" type="number" min="1" value="${preset.partySize || 2}" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-brand-700" for="res-m-table">Table</label>
                  <select id="res-m-table" class="h-10 px-3 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500">${tableOptions}</select>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-brand-700" for="res-m-notes">Notes</label>
                <textarea id="res-m-notes" rows="2" placeholder="Any special requests..." class="px-3 py-2 text-sm rounded-md border border-brand-300 bg-brand-50 outline-none focus:border-brand-500 resize-none">${preset.notes || ""}</textarea>
              </div>
            </div>
            <div class="px-5 py-3 border-t border-brand-100 flex justify-end gap-3">
              <button data-res-cancel class="h-9 px-4 text-sm font-semibold rounded-lg bg-white text-brand-700 border border-brand-300 hover:bg-brand-50 cursor-pointer transition-colors">Cancel</button>
              <button data-res-confirm class="h-9 px-4 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors">Save</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this._container);
      window.createIcons();

      const overlay = this._container.querySelector("[data-res-overlay]");
      const modal = this._container.querySelector("[data-res-modal]");
      const closeBtn = this._container.querySelector("[data-res-close]");
      const cancelBtn = this._container.querySelector("[data-res-cancel]");
      const confirmBtn = this._container.querySelector("[data-res-confirm]");
      const guestInput = this._container.querySelector("#res-m-guest");

      if (guestInput) guestInput.focus();

      const close = (result) => {
        overlay.classList.add("animate-backdrop-out");
        if (modal) modal.classList.add("animate-modal-out");
        overlay.addEventListener("animationend", () => {
          this._container.remove();
          this._container = null;
        });
        if (this._resolve) {
          this._resolve(result);
          this._resolve = null;
        }
      };

      const gather = () => ({
        guestName: (this._container.querySelector("#res-m-guest") || {}).value || "",
        guestPhone: (this._container.querySelector("#res-m-phone") || {}).value || "",
        date: (this._container.querySelector("#res-m-date") || {}).value || "",
        time: (this._container.querySelector("#res-m-time") || {}).value || "",
        partySize: parseInt((this._container.querySelector("#res-m-party") || {}).value) || 2,
        tableId: (this._container.querySelector("#res-m-table") || {}).value || null,
        notes: (this._container.querySelector("#res-m-notes") || {}).value || "",
      });

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close(null);
      });
      closeBtn.addEventListener("click", () => close(null));
      cancelBtn.addEventListener("click", () => close(null));

      confirmBtn.addEventListener("click", () => {
        const data = gather();
        if (!data.guestName.trim() || !data.date || !data.time) {
          const firstEmpty = !data.guestName.trim()
            ? this._container.querySelector("#res-m-guest")
            : !data.date
              ? this._container.querySelector("#res-m-date")
              : this._container.querySelector("#res-m-time");
          if (firstEmpty) {
            firstEmpty.classList.add("border-error-600");
            firstEmpty.focus();
            setTimeout(() => firstEmpty.classList.remove("border-error-600"), 2000);
          }
          return;
        }
        close(data);
      });

      const handleKey = (e) => {
        if (e.key === "Escape") {
          close(null);
          document.removeEventListener("keydown", handleKey);
        }
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          confirmBtn.click();
        }
      };
      document.addEventListener("keydown", handleKey);
    });
  }
}

export const reservationModal = new ReservationModal();
