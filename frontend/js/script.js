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

        for (let i = 1; i <= 4; i++) {
            // Create the section div
            const section = document.createElement('div');
            section.className = 'section';

            // Create the section content
            const sectionContent = document.createElement('div');
            sectionContent.className = 'section-content';

            const paragraph = document.createElement('p');
            paragraph.textContent = 'Hier kommt der Inhalt für diesen Abschnitt hin.';

            sectionContent.appendChild(paragraph);
            section.appendChild(sectionContent);

            // Append section to the content area
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
