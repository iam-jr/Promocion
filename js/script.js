const form = document.querySelector("#promo-form");
const toast = document.querySelector("#success-toast");
const zoneInput = document.querySelector("#zone");
const clientNameInput = document.querySelector("#client-name");
const clientPhoneInput = document.querySelector("#client-phone");

const summaryFields = {
	vehicle: document.querySelector("#summary-vehicle"),
	size: document.querySelector("#summary-size"),
	audioProfile: document.querySelector("#summary-audio"),
	audioDescription: document.querySelector("#summary-audio-description"),
	zone: document.querySelector("#summary-zone")
};

const state = {
	vehicle: "",
	size: "",
	promotionType: "",
	promotionDescription: "",
	zone: "",
	clientName: "",
	clientPhone: ""
};

const promotionButtons = Array.from(document.querySelectorAll(".promotion-select"));
const quickSelectButtons = Array.from(document.querySelectorAll(".quick-select"));
const modalPickButtons = Array.from(document.querySelectorAll(".modal-pick"));
const openModalButtons = Array.from(document.querySelectorAll(".open-modal"));
const closeModalButtons = Array.from(document.querySelectorAll("[data-close-modal]"));
const modals = Array.from(document.querySelectorAll(".modal"));

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("is-visible");
	window.setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

function buildWhatsappMessage() {
	const message = [
		"Hola Promo Rodante PR, quiero solicitar una promocion.",
		"",
		`Guagua: ${state.vehicle}`,
		`Cobertura: ${state.size}`,
		`Tipo de promocion: ${state.promotionType}`,
		`Detalle promocion: ${state.promotionDescription}`,
		`Zona: ${state.zone}`,
		"",
		`Nombre: ${state.clientName}`,
		`Telefono: ${state.clientPhone}`
	].join("\n");

	return `https://wa.me/17870000000?text=${encodeURIComponent(message)}`;
}

function updateSummary() {
	summaryFields.vehicle.textContent = state.vehicle || "Pendiente";
	summaryFields.size.textContent = state.size || "Pendiente";
	summaryFields.audioProfile.textContent = state.promotionType || "Pendiente";
	summaryFields.audioDescription.textContent = state.promotionDescription || "Pendiente";
	summaryFields.zone.textContent = state.zone || "Pendiente";
}

function selectVehicle(vehicle, size, audio) {
	state.vehicle = vehicle;
	state.size = size;

	document.querySelectorAll(".vehicle-tile").forEach((tile) => {
		tile.classList.toggle("is-selected", tile.dataset.vehicle === vehicle);
	});

	updateSummary();
}

function selectPromotion(button) {
	promotionButtons.forEach((btn) => btn.classList.remove("is-selected"));
	button.classList.add("is-selected");
	state.promotionType = button.dataset.promotion;
	state.promotionDescription = button.dataset.description;
	updateSummary();
}

function openModal(id) {
	const modal = document.querySelector(`#${id}`);
	if (!modal) {
		return;
	}
	modal.classList.add("is-open");
	modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
	modal.classList.remove("is-open");
	modal.setAttribute("aria-hidden", "true");
}

openModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		openModal(button.dataset.modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const modal = button.closest(".modal");
		if (modal) {
			closeModal(modal);
		}
	});
});

modals.forEach((modal) => {
	modal.addEventListener("click", (event) => {
		if (event.target === modal) {
			closeModal(modal);
		}
	});
});

document.addEventListener("keydown", (event) => {
	if (event.key !== "Escape") {
		return;
	}

	modals.forEach((modal) => {
		if (modal.classList.contains("is-open")) {
			closeModal(modal);
		}
	});
});

quickSelectButtons.forEach((button) => {
	button.addEventListener("click", () => {
		selectVehicle(button.dataset.vehicle, button.dataset.size, button.dataset.audio);
		showToast(`${button.dataset.vehicle} seleccionada.`);
		document.querySelector("#cotizador")?.scrollIntoView({ behavior: "smooth" });
	});
});

modalPickButtons.forEach((button) => {
	button.addEventListener("click", () => {
		selectVehicle(button.dataset.vehicle, button.dataset.size, button.dataset.audio);

		updateSummary();
		showToast(`${state.vehicle} seleccionada.`);

		const modal = button.closest(".modal");
		if (modal) {
			closeModal(modal);
		}
	});
});

promotionButtons.forEach((button) => {
	button.addEventListener("click", () => {
		selectPromotion(button);
	});
});

zoneInput.addEventListener("input", () => {
	state.zone = zoneInput.value.trim();
	updateSummary();
});

form.addEventListener("submit", (event) => {
	event.preventDefault();

	state.zone = zoneInput.value.trim();
	state.clientName = clientNameInput.value.trim();
	state.clientPhone = clientPhoneInput.value.trim();

	if (!state.vehicle) {
		showToast("Primero selecciona una guagua.");
		return;
	}

	if (!state.promotionType) {
		showToast("Selecciona: audio, banner o audio y banner promocion.");
		return;
	}

	if (!state.zone || !state.clientName || !state.clientPhone) {
		showToast("Completa zona, nombre y telefono.");
		return;
	}

	updateSummary();
	const whatsappUrl = buildWhatsappMessage();
	window.open(whatsappUrl, "_blank", "noopener,noreferrer");
	showToast("Abriendo WhatsApp con tu solicitud...");
	form.reset();

	promotionButtons.forEach((button) => button.classList.remove("is-selected"));
	state.zone = "";
	state.clientName = "";
	state.clientPhone = "";
	state.promotionType = "";
	state.promotionDescription = "";
	updateSummary();
});

updateSummary();
