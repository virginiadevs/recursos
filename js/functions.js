let data;

const menu = document.querySelector(".tags-menu");
const tagsList = document.querySelector(".tags-list");
const tagsCb = document.querySelector("#tags-cb");
const cbLabel = document.querySelector(".tags-menu label");
const searchInput = document.querySelector("#search-input");
const resourcesList = document.querySelector(".resources-list");

loadData();
registerEvents();

async function loadData() {
    const response = await fetch("files/resources.json");
    data = await response.json();

    renderResources(data.resources);
    renderCategories(data.availableTags);
}

// Mostrar categorías
function renderCategories(tags) {
    tags.forEach(tag => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-item");

        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.setAttribute("data-category", tag.toLowerCase());

        li.appendChild(btn);
        tagsList.appendChild(li);
        tagsList.classList.add("hidden");
        cbLabel.classList.remove("checked");
    });
}

// Mostrar recursos
function renderResources(resources) {
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

function registerEvents() {
    // Mostrar y ocultar menú pulsando el propio menú
    tagsCb.addEventListener("change", toggleMenu);

    // Ocultar menú al pulsar en cualquier otra parte
    document.addEventListener("click", closeMenu);

    // Filtro de búsqueda
    searchInput.addEventListener("input", searchResources);

    // Filtrar por categorías
    tagsList.addEventListener("click", filterResources); // <-- ARREGLAR ESTO
}
// ---------------------------------------------------------------------------------------

function toggleMenu() {
    tagsList.classList.toggle("hidden", !tagsCb.checked);
    cbLabel.classList.toggle("checked", tagsCb.checked);
}

function closeMenu(ev) {
    if(!menu.contains(ev.target)) {
        tagsCb.checked = false;
        tagsList.classList.add("hidden");
        cbLabel.classList.remove("checked");
    }
}

function searchResources() {
    const inputText = searchInput.value.toLowerCase();
    const resources = document.querySelectorAll(".resources-list .list-item a");
    
    resources.forEach(resource => {
        const resourceText = resource.textContent.toLowerCase();
        resource.parentElement.style.display = "none";
        resource.parentElement.style.display = resourceText.includes(inputText) ? "" : "none";
    });
}

function filterResources(ev) {
    resourcesList.replaceChildren();

    const btn = ev.target.closest("button");

    if(!btn) return;

    const category = btn.dataset.category;
    const filteredResources = data.resources.filter(
        resource => resource.tags.includes(category)
    );

    renderResources(filteredResources);
}
// ---------------------------------------------------------------------------------------

/* --- LIGHT/DARK MODE --- 
const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
        return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    
    return "light";
})();

if (theme === "light") {
    document.documentElement.classList.remove("dark");
}
else {
    document.documentElement.classList.add("dark");
}

window.localStorage.setItem("theme", theme);

const handleToggleClick = () => {
    const element = document.documentElement;
    element.classList.toggle("dark");

    const isDark = element.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}*/

/*document.getElementById("headerThemeToggle").addEventListener("click", handleToggleClick);
document.getElementById("mobileThemeToggle").addEventListener("click", handleToggleClick);*/
// ---------------------------------------------------------------------------------------