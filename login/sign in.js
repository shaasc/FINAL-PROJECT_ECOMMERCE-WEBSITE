document.querySelector('.login-btn').addEventListener('click', login);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        login(event);
    }
});

function login(event) {
    // Prevent default form submission behavior (if inside a form)
    event.preventDefault();

    // Get the username and password values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    if (username === 'admin' && password === '1234') {
        // Redirect to admin.html if credentials match
        window.location.href = '/admin/DashboardPage/dashboard.html';
    } else {
        // Show an error alert if credentials don't match
        alert('Invalid username or password. Please try again.');
    }
}
