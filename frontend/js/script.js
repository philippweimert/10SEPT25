document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    const routes = {
        '/': 'pages/home.html',
        '/pages/bav.html': 'pages/bav.html',
        '/pages/bkv.html': 'pages/bkv.html',
        '/pages/service.html': 'pages/service.html',
        '/pages/news.html': 'pages/news.html',
        '/pages/uber-uns.html': 'pages/uber-uns.html',
        '/pages/kontakt.html': 'pages/kontakt.html'
    };

    const insertEmptySections = () => {
        const contentArea = document.querySelector('.content');
        if (!contentArea) return;

        const isBavPage = window.location.pathname === '/pages/bav.html';

        for (let i = 1; i <= 4; i++) {
            const section = document.createElement('div');
            section.className = 'section';

            // If it's the bAV page and the first section to be added, create the special layout
            if (isBavPage && i === 1) {
                section.id = 'bav-process-section';

                const sectionContent = document.createElement('div');
                sectionContent.className = 'section-content two-column'; // new class for styling

                const leftColumn = document.createElement('div');
                leftColumn.className = 'bav-process-left';
                leftColumn.innerHTML = `
                    <div class="bav-process-grid">
                        <div class="hexagon-card card-top">
                            <div class="hexagon-content">
                                <p>Analyse &amp; Rechtliche</p>
                                <p>Prüfung</p>
                            </div>
                        </div>
                        <div class="hexagon-card card-left">
                            <div class="hexagon-content">
                                <p>Kontinuierliche Betreuung</p>
                                <p>&amp; Verwaltung</p>
                            </div>
                        </div>
                        <div class="bav-process-center">
                             <svg class="arrow-circle" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <marker id="arrowhead-js" markerWidth="4" markerHeight="3.2" refX="4" refY="1.6" orient="auto" overflow="visible">
                                        <polygon points="0,0 4,1.6 0,3.2" fill="white" stroke="#001f3f" stroke-width="0.3"/>
                                    </marker>
                                </defs>
                                <path d="M 60 10 A 50 50 0 0 1 103.3 85" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" marker-end="url(#arrowhead-js)"/>
                                <path d="M 103.3 85 A 50 50 0 0 1 16.7 85" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" marker-end="url(#arrowhead-js)"/>
                                <path d="M 16.7 85 A 50 50 0 0 1 60 10" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" marker-end="url(#arrowhead-js)"/>
                            </svg>
                            <div class="center-circle">
                                <p class="center-text-large">bAV</p>
                                <p class="center-text-small">Prozess</p>
                            </div>
                        </div>
                        <div class="hexagon-card card-right">
                            <div class="hexagon-content">
                                <p>Einrichtung, Digitalisierung</p>
                                <p>&amp; Automatisierung</p>
                            </div>
                        </div>
                        <div class="hexagon-card card-bottom">
                            <div class="hexagon-content">
                                <p>Mitarbeiterkommunikation</p>
                                <p>&amp; Beratung</p>
                            </div>
                        </div>
                    </div>
                `;

                const rightColumn = document.createElement('div');
                rightColumn.className = 'bav-process-right';

                sectionContent.appendChild(leftColumn);
                sectionContent.appendChild(rightColumn);
                section.appendChild(sectionContent);

            } else {
                // Keep the original logic for other sections/pages
                const sectionContent = document.createElement('div');
                sectionContent.className = 'section-content';

                const paragraph = document.createElement('p');
                paragraph.textContent = 'Hier kommt der Inhalt für diesen Abschnitt hin.';

                sectionContent.appendChild(paragraph);
                section.appendChild(sectionContent);
            }

            contentArea.appendChild(section);
        }
    };

    const loadContent = async (path) => {
        try {
            // Always fetch from the root
            const response = await fetch('/' + path);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const html = await response.text();
            content.innerHTML = html;
            setActiveLink(window.location.pathname);

            // Add empty sections to all pages except 'kontakt'
            if (window.location.pathname !== '/pages/kontakt.html') {
                insertEmptySections();
            }

            // NEW: Rearrange sections on the bAV page
            if (window.location.pathname === '/pages/bav.html') {
                const contentArea = document.querySelector('.content');
                if (contentArea) {
                    const allSections = contentArea.querySelectorAll('.section');
                    // The "Für jede Unternehmensgröße" section is the first one loaded from bav.html
                    // The empty sections are appended after.
                    // So allSections[0] is the one to move.
                    // allSections[1] is the first empty section.
                    if (allSections.length > 1) {
                        const companySizeSection = allSections[0];
                        const firstEmptySection = allSections[1];
                        // Insert the company size section after the first empty section
                        firstEmptySection.insertAdjacentElement('afterend', companySizeSection);
                    }
                }
            }
        } catch (error) {
            content.innerHTML = '<p>Error loading page. Please try again.</p>';
            console.error('Failed to load page:', error);
        }
    };

    const setActiveLink = (path) => {
        sidebarLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === path) {
                link.querySelector('.sidebar-item').classList.add('active');
            } else {
                link.querySelector('.sidebar-item').classList.remove('active');
            }
        });
    };

    const router = () => {
        const path = window.location.pathname;
        const route = routes[path] || 'pages/404.html';
        loadContent(route);
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const path = new URL(e.currentTarget.href).pathname;
            history.pushState({}, '', path);
            router();
        });
    });

    window.addEventListener('popstate', router);

    // Initial load
    router();

    // Event delegation for the contact form
    content.addEventListener('submit', async (e) => {
        if (e.target.id === 'contact-form') {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Get values from the form by ID, since FormData doesn't work with our setup
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            const payload = {
                name,
                email,
                company,
                phone,
                message
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Nachricht erfolgreich gesendet!');
                    form.reset();
                } else {
                    alert(`Fehler: ${result.message}`);
                }
            } catch (error) {
                console.error('Fehler beim Senden des Formulars:', error);
                alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
            }
        }
    });

    // Scroll to top functionality
    const scrollToTopButton = document.getElementById('scroll-to-top');
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', e => {
            e.preventDefault();
            const contentArea = document.querySelector('.content');
            if (contentArea) {
                contentArea.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});
