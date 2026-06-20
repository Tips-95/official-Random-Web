async function saveMovieSettings() {

    db.movie = {
        title: document.getElementById("movie-title").value,
        tagline: document.getElementById("movie-tagline").value,
        synopsis: document.getElementById("movie-synopsis").value,
        poster: document.getElementById("movie-poster").value,
        trailer: document.getElementById("movie-trailer").value,
        status: document.getElementById("movie-status").value,
        progress: parseInt(document.getElementById("movie-progress").value) || 0,
        note: document.getElementById("movie-note").value
    };

    await saveAll();

    alert("Movie settings saved!");
}
