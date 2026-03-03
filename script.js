const projects = [
    {
        title: 'Starter Portfolio Project',
        description: 'Placeholder case study block. Replace this with a real website project summary, screenshots, and outcomes.',
        items: ['Status: Placeholder', 'Type: Static Website', 'Stack: HTML • CSS • JavaScript']
    },
    {
        title: 'Creative Brand Landing',
        description: 'Second placeholder for a future client launch page. Use this slot for your next completed project.',
        items: ['Status: Placeholder', 'Type: Landing Page', 'Stack: HTML • CSS • Lightweight JS']
    },
    {
        title: 'Studio Showcase Site',
        description: 'Third placeholder entry designed for a multi-section brand website with custom visuals.',
        items: ['Status: Placeholder', 'Type: Multi-section Website', 'Stack: Semantic HTML • CSS Grid • Vanilla JS']
    }
];

const yearNode = document.getElementById('year');
const viewNode = document.getElementById('portfolio-view');
const tabButtons = document.querySelectorAll('.tab-btn');

function renderProject(index) {
    const project = projects[index];
    if (!project || !viewNode) return;

    viewNode.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul>
            ${project.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <a class="btn btn-primary disabled" href="#" aria-disabled="true">Demo Coming Soon</a>
    `;

    tabButtons.forEach((button) => {
        const buttonIndex = Number(button.dataset.project);
        button.classList.toggle('active', buttonIndex === index);
    });
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const index = Number(button.dataset.project);
        renderProject(index);
    });
});

if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}

renderProject(0);
