window.addEventListener("DOMContentLoaded", () => {

    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        let link = card.querySelector('.project-link');
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            link.click();
        });
    });
});