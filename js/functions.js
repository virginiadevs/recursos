let data;

const searchInput = document.querySelector("#search-input");
const tagsList = document.querySelector("#tags-list");
const resourcesList = document.querySelector(".resources-list");

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
        const option = document.createElement("option");
        option.setAttribute("value", tag.toLowerCase());
        option.textContent = tag;
        tagsList.appendChild(option);
    });
}

// Mostrar recursos
function renderResources(resources) {
    resources.sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );
    resources.forEach(resource => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-item");

        const link = document.createElement("a");
        link.href = resource.url;
        link.textContent = resource.name;
        link.target = "_blank";

        li.appendChild(link);
        resourcesList.appendChild(li);
    });
}
// ---------------------------------------------------------------------------------------

searchInput.addEventListener("input", filterResources);
tagsList.addEventListener("change", filterResources);

function filterResources() {
    document.querySelector(".resources-list").replaceChildren();

    const category = tagsList.value;
    const search = searchInput.value.trim().toLowerCase();

    const filteredResources = data.resources.filter(resource => {
        const matchesCategory = !category || resource.tags.includes(category);

        const matchesSearch = !search || resource.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    renderResources(filteredResources);
}
