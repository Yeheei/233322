(function() {
    const authTimestamp = localStorage.getItem('authTimestamp');
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    // If there's no timestamp, or if the timestamp is older than 7 days,
    // clear the timestamp and redirect to the login page.
    if (!authTimestamp || (Date.now() - parseInt(authTimestamp, 10) > sevenDaysInMs)) {
        localStorage.removeItem('authTimestamp');
        // Redirect to the login page, which is index.html
        window.location.href = 'index.html';
    }
})();
