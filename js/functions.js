/* --- LIGHT/DARK MODE --- */
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
}

/*document.getElementById("headerThemeToggle").addEventListener("click", handleToggleClick);
document.getElementById("mobileThemeToggle").addEventListener("click", handleToggleClick);*/
// ---------------------------------------------------------------------------------------

/* --- VIEW RESOURCES --- */
fetch("files/resources.json")
    .then(response => response.json())
    .then(data => {
        const list = document.querySelector(".resources-list");

        data.resources.forEach(resource => {
            const li = document.createElement("li");
            li.setAttribute("class", "list-item");

            const link = document.createElement("a");
            link.href = resource.url;
            link.textContent = resource.name;
            link.target = "_blank";

            li.appendChild(link);
            list.appendChild(li);
        });
    })
    .catch(err => console.error(err));
// ---------------------------------------------------------------------------------------

/* --- RESOURCES FILTER --- */
const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", () => {
    const inputText = searchInput.value.toLowerCase();
    const resources = document.querySelectorAll(".resources-list .list-item a");
    
    resources.forEach(resource => {
        const resourceText = resource.textContent.toLowerCase();
        resource.parentElement.style.display = "none";
        resource.parentElement.style.display = resourceText.includes(inputText) ? "" : "none";
    });
});
// ---------------------------------------------------------------------------------------

/* --- VIEW TAGS --- */
const menu = document.querySelector(".tags-menu");
const list = document.querySelector(".tags-list");
const tagsCb = document.querySelector("#tags-cb");

fetch("files/resources.json")
    .then(response => response.json())
    .then(data => {
        data.availableTags.forEach(tag => {
            const li = document.createElement("li");
            li.setAttribute("class", "list-item");

            const btn = document.createElement("button");
            btn.textContent = tag;

            li.appendChild(btn);
            list.appendChild(li);
        });

        list.classList.add("hidden");
    })
    .catch(err => console.error(err));

// Mostrar y ocultar menú pulsando el propio menú
tagsCb.addEventListener("change", () => {
    list.classList.toggle("hidden", !tagsCb.checked);
});

// Ocultar menú al pulsar en cualquier otra parte
document.addEventListener("click", (ev) => {
    if(!menu.contains(ev.target)) {
        tagsCb.checked = false;
        list.classList.add("hidden");
    }
});