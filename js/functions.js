const searchInput = document.querySelector("#search-input");
const tagsList = document.querySelector(".tags-group");
const resourcesList = document.querySelector(".resources-list");

let data;
let currentPage = 1;
const elementsPerPage = 20;

loadData();

async function loadData() {
    try {
        const response = await fetch("files/resources.json");
        data = await response.json();

        if (!response.ok) {
            throw new Error("No se pudo cargar el JSON");
        }

        renderResources(data.resources);
        renderCategories(data.tags);
    }
    catch(err) {
        console.error("Error: ", err);
    }
}

// Mostrar categorías
function renderCategories(tags) {
    tags.sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" })
    );
    tags.forEach(tag => {
        const tagBtn = document.createElement("button");
        tagBtn.type = "button";
        tagBtn.setAttribute("value", tag.toLowerCase());
        tagBtn.textContent = tag;

        tagBtn.addEventListener("click", () => {
            tagBtn.classList.toggle("active");
            currentPage = 1;
            filterResources();
        });

        tagsList.appendChild(tagBtn);
    });
}

// Mostrar recursos
function renderResources(resources) {
    // Ordenar alafabéticamente
    resources.sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    // Índices de página
    const first = (currentPage - 1) * elementsPerPage;
    const last = first + elementsPerPage;
    const resourcesPage = resources.slice(first, last);

    // Mostrar
    resourcesPage.forEach(resource => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-item");

        const link = document.createElement("a");
        link.href = resource.url;
        link.textContent = resource.name;
        link.target = "_blank";

        li.appendChild(link);
        resourcesList.appendChild(li);
    });

    updatePagination(resources.length);
}

// Paginación
function updatePagination(elements) {
    const pagesTotal = Math.ceil(elements / elementsPerPage);
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    // Si solo hay 1 página o ninguna, no se muestran los controles
    if (pagesTotal <= 1) return;

    // Botón Anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.disabled = currentPage === 1;
    btnAnterior.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            filterResources(); // Vuelve a filtrar y renderizar
        }
    });
    pagination.appendChild(btnAnterior);

    // Indicador de página (ej: Página 1 de 3)
    const spanInfo = document.createElement("span");
    spanInfo.textContent = `Página ${currentPage} de ${pagesTotal}`;
    pagination.appendChild(spanInfo);

    // Botón Siguiente
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.disabled = currentPage === pagesTotal;
    btnSiguiente.addEventListener("click", () => {
        if (currentPage < pagesTotal) {
            currentPage++;
            filterResources(); // Vuelve a filtrar y renderizar
        }
    });
    pagination.appendChild(btnSiguiente);
}
// ---------------------------------------------------------------------------------------

searchInput.addEventListener("input", () => {
    currentPage = 1;
    filterResources();
});

function filterResources() {
    document.querySelector(".resources-list").replaceChildren();
    activeButtons = document.querySelectorAll(".tags-group button.active");
    const selectedCategories = Array.from(activeButtons).map(btn => btn.value);
    
    const search = searchInput.value.trim().toLowerCase();

    const filteredResources = data.resources.filter(resource => {
        const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.some(cat => resource.tags.includes(cat));

        const matchesSearch = !search || resource.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    renderResources(filteredResources);
}
