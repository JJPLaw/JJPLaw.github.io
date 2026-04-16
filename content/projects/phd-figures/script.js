// sources
// https://codepen.io/midnightviking/pen/poXjgQv
// https://stackoverflow.com/questions/72684103/how-to-close-an-element-by-clicking-outside-of-it
// https://kittygiraudel.com/2021/03/18/close-on-outside-click/

// waits for everything to load before adding listeners to the cards
// probably not necessary but could be generally useful
window.addEventListener("DOMContentLoaded", () => {
    let cards = document.querySelectorAll(".card");
    let expandedCards = document.querySelectorAll(".expanded-card");
    let closeButtons = document.querySelectorAll(".close");

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            let ids = cardMatcher(card);

            document.querySelector('.active-card') !== null ? document.querySelector('.active-card').classList.remove('active-card') : null;
            document.querySelector('.active-expanded-card') !== null ? document.querySelector('.active-expanded-card').classList.remove('active-expanded-card') : null;

            cardToggler(ids);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            let ids = cardMatcher(button.parentNode);
            cardToggler(ids);
        });
    });

    // this might not be the best way of doing it in the long run because it loops over the cards every click, but it works
    // document.addEventListener('click', (e) => {     
    //     expandedCards.forEach(
    //         (expandedCard) => {
    //             if (!expandedCard.contains(e.target)) {
    //                 expandedCard.classList.remove("active-expanded-card");
    //             }
    //         });
    // });
});

function cardMatcher(element) {
    let id = element.id;
    let cardId, expandedCardId, ids;
    if (id.includes('card')) {
        let idNumber = id.slice(-1);
        cardId = 'card' + idNumber;
        expandedCardId = 'expanded-card' + idNumber;
        ids = {
            "cardId": cardId,
            "expandedCardId": expandedCardId
        }
    }
    return ids;
}

function cardToggler(ids) {
    document.querySelector(`#${ids.cardId}`).classList.toggle('active-card');
    document.querySelector(`#${ids.expandedCardId}`).classList.toggle('active-expanded-card');
}