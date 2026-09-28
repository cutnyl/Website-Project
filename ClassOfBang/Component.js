fetch("header.html")
    .then(response => response.text())
    .then(data => {
        // 1. Masukkan HTML header ke DOM
        document.getElementById("header").innerHTML = data;

        // 2. Cari elemen SETELAH HTML dimasukkan
        const hamburger = document.getElementById("hamburger");
        const nav = document.getElementById("main-nav");

        if (hamburger && nav) {
            hamburger.addEventListener("click", function (e) {
                e.preventDefault(); // Mencegah reload jika tombol ada di dalam tag <a>
                nav.classList.toggle("nav-open");
                hamburger.classList.toggle("is-open");
            });
        }
    })
    .catch(error => console.error("Gagal memuat header:", error));

fetch("Footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });