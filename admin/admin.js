document.addEventListener('DOMContentLoaded', () => {
    const logout = document.getElementById('logout');
    const navLinks = document.querySelectorAll('.nav-link');


    logout.addEventListener('mouseenter', () => {
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.textContent = 'Logout';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.transform = 'translate(-50%, -120%)';
        tooltip.style.pointerEvents = 'none';

        // Position tooltip based on logout element
        const rect = logout.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top}px`;

        // Add tooltip to the document
        document.body.appendChild(tooltip);
    });

    logout.addEventListener('mouseleave', () => {
        // Remove the tooltip
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });

    //GO TO SIGN IN WHEN LOGOUT BUTTON IS CLICKED
    document.addEventListener('DOMContentLoaded', () => {
        const logout = document.getElementById('logout');
    
        logout.addEventListener('click', (event) => {
            event.preventDefault(); // Prevents default anchor behavior (optional)
            window.location.href = '/login/sign in.html'; // Redirect to signin.html
        });
    });

    
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                navLinks.forEach(nav => nav.classList.remove('active'));
                // Add active class to the clicked link
                link.classList.add('active');
            });
        });
    
        // Highlight the active link based on the current URL
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });
    
