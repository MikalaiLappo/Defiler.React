

/* FETCH WITH TIMEOUT */
async function fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

async function loadGames() {
    try {
        const response = await fetchWithTimeout('/games', {
            timeout: 6000
        });
        const games = await response.json();
        return games;
    } catch (error) {
        // Timeouts if the request takes
        // longer than 6 seconds
        console.log(error.name === 'AbortError');
    }
}