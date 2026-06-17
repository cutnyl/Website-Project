fetch("header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const hamburger = document.getElementById("hamburger");
        const nav = document.getElementById("main-nav");
        if (hamburger && nav) {
            hamburger.addEventListener("click", function () {
                nav.classList.toggle("nav-open");
                hamburger.classList.toggle("is-open");
            });
        }
    });

fetch("Footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });