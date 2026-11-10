// MY BRAND FOOTER

class myFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            footer {
                margin: 1rem 0; display: flex; justify-content: center; align-items: center;
            }
            footer .my-logo {
                --size: 40px; width: var(--size); height: var(--size);
            }
            footer p {
                font-size: 12px; color: var(--grey); margin-top: 9px;
            }
        </style>
        <footer>
            <figure class="my-logo">
                <img src="img/virginiadevs-logo.webp" alt="Logo de VirginiaDevs">
            </figure>

            <p>Creado con <i class="fas fa-heart"></i> por VirginiaDevs.</p>
        </footer>
        `;
    }
}

customElements.define("brand-footer", myFooter);