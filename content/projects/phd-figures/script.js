// sources
// https://codepen.io/midnightviking/pen/poXjgQv
// https://stackoverflow.com/questions/72684103/how-to-close-an-element-by-clicking-outside-of-it
// https://kittygiraudel.com/2021/03/18/close-on-outside-click/

// waits for everything to load before adding listeners to the cards
// probably not necessary but could be generally useful
window.addEventListener("DOMContentLoaded", () => {
    let cards = document.querySelectorAll(".card");

    // this might not be the best way of doing it in the long run because it loops over the cards every click, but it works
    document.addEventListener('click', (e) => {
        cards.forEach(
            (card) => {
                if (!card.contains(e.target))
                    card.classList.remove("active");
                else
                    card.classList.toggle("active");
            });
    });
});