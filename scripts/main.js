const navLink = document.querySelectorAll(".header-nav-content-link");

navLink.forEach((el) => {
    el.addEventListener("click", (event) => {
        event.preventDefault();
    })
})

