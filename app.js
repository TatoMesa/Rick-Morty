const API = "https://rickandmortyapi.com/api/character";

const contenedor = document.getElementById("personajes");
const mensaje = document.getElementById("mensaje");
const search = document.getElementById("search");
const statusSelect = document.getElementById("status");
const cargarMasBtn = document.getElementById("cargarMas");

const modal = document.getElementById("modal");
const detalle = document.getElementById("detalle");
const cerrar = document.getElementById("cerrar");

let page = 1;
let personajes = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let mostrandoFavoritos = false;

// ================= FETCH =================
async function obtenerPersonajes(reset = false) {
  try {
    mensaje.textContent = "Cargando...";
    const url = `${API}?page=${page}&name=${search.value}&status=${statusSelect.value}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se encontraron resultados");
    const data = await res.json();

    if (reset) personajes = [];
    personajes.push(...data.results);

    renderizar(personajes);
    mensaje.textContent = "";
  } catch (err) {
    mensaje.textContent = err.message;
  }
}

// ================= RENDER =================
function renderizar(lista) {
  contenedor.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" />
      <div class="card-body">
        <h4>${p.name}</h4>
        <p>${p.status} - ${p.species}</p>
        <button data-id="${p.id}">
          ${esFavorito(p.id) ? "★ Quitar" : "☆ Favorito"}
        </button>
      </div>
    `;

    card.addEventListener("click", e => {
      if (e.target.tagName === "BUTTON") return;
      mostrarDetalle(p);
    });

    card.querySelector("button").addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorito(p);
      renderizar(lista);
    });

    contenedor.appendChild(card);
  });
}

// ================= DETALLE =================
function mostrarDetalle(p) {
  modal.classList.remove("hidden");

  detalle.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.image}" width="100%" />
    <p><b>Status:</b> ${p.status}</p>
    <p><b>Especie:</b> ${p.species}</p>
    <p><b>Origen:</b> ${p.origin.name}</p>
    <p><b>Ubicación:</b> ${p.location.name}</p>
    <p><b>Episodios:</b> ${p.episode.length}</p>
  `;
}

cerrar.onclick = () => modal.classList.add("hidden");

// ================= FAVORITOS =================
function toggleFavorito(personaje) {
  if (esFavorito(personaje.id)) {
    favoritos = favoritos.filter(f => f.id !== personaje.id);
  } else {
    favoritos.push(personaje);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function esFavorito(id) {
  return favoritos.some(f => f.id === id);
}

// ================= EVENTOS =================
search.addEventListener("input", () => {
  page = 1;
  obtenerPersonajes(true);
});

statusSelect.addEventListener("change", () => {
  page = 1;
  obtenerPersonajes(true);
});

cargarMasBtn.addEventListener("click", () => {
  page++;
  obtenerPersonajes();
});

document.getElementById("favoritosBtn").addEventListener("click", () => {
  mostrandoFavoritos = !mostrandoFavoritos;
  cargarMasBtn.style.display = mostrandoFavoritos ? "none" : "block";
  renderizar(mostrandoFavoritos ? favoritos : personajes);
});

// ================= INIT =================
obtenerPersonajes();