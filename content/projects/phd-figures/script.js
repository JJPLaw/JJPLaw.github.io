const windowSmall = window.matchMedia("(max-width: 950px)").matches;

// waits for everything to load before adding listeners to the cards
// probably not necessary but could be generally useful
window.addEventListener("DOMContentLoaded", () => {
    let cards = document.querySelectorAll(".card");
    let expandedCards = document.querySelectorAll(".expanded-card");
    let closeButtons = document.querySelectorAll(".close");
    let expandedImages = document.querySelectorAll(".expanded-image");
    let dialogs = document.querySelectorAll('dialog');
    let dialogCloseButtons = document.querySelectorAll(".dialogClose");

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            let ids = cardMatcher(card);

            if (card.classList.contains('active-card')) {
                e.stopPropagation();
                cardToggler(ids);
            } else {
                e.stopPropagation();
                cardCloser();
                cardToggler(ids);
            }
        });
    });

    // if the target isn't an active card, active expanded card, and there's no dialog open, then close the cards
    // document.addEventListener('click', (e) => {
    //     if (!(e.target.classList.contains('active-card')) && !(e.target.classList.contains('active-expanded-card')) && (document.querySelector('dialog:modal') == null)) {
    //         console.log(e.target);
    //         console.log(e.currentTarget);
    //         cardCloser();
    //     }
    // });

    expandedImages.forEach((image) => {
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            image.nextElementSibling.showModal();
            // this (along with the css for overflow) stops scrolling underneath, which is supported differently in chrome to the others
            document.body.style.overflow = 'hidden';
        });
    });

    dialogCloseButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            // need this so that the document level event listener doesn't just trigger every time
            e.stopPropagation();
            button.parentElement.close();
            document.body.style.overflow = 'visible';
        });
    });

    // this essentially reimplements the closedBy='any' behaviour, which isn't supported by safari 
    dialogs.forEach((dialog) => {
        dialog.addEventListener('click', (e) => {
            if (e.target.getAttributeNames().includes('open')) {
                e.stopPropagation();
                dialog.close();
                document.body.style.overflow = 'visible';
            }
        });
    });

    if (windowSmall) {
        expandedCards.forEach((expandedCard) => {
            let ids = cardMatcher(expandedCard);

            let card = document.querySelector(`#${ids.cardId}`);

            card.after(expandedCard);
        });
    }
});

function cardMatcher(element) {
    let id = element.id;
    let cardId, expandedCardId, closeCardId, ids;
    if (id.includes('card')) {
        let idNumber = id.slice(-1);
        cardId = 'card' + idNumber;
        expandedCardId = 'expanded-card' + idNumber;
        closeCardId = 'close-card' + idNumber;
        ids = {
            "cardId": cardId,
            "expandedCardId": expandedCardId,
            "closeCardId": closeCardId,
        }
    }
    return ids;
}

function cardToggler(ids) {
    document.getElementById(ids.cardId).classList.toggle('active-card');
    document.getElementById(ids.expandedCardId).classList.toggle('active-expanded-card');
    document.getElementById(ids.cardId).scrollIntoView({ behavior: 'smooth' });
}

function cardCloser() {
    document.querySelector('.active-card') !== null ? document.querySelector('.active-card').classList.remove('active-card') : null;
    document.querySelector('.active-expanded-card') !== null ? document.querySelector('.active-expanded-card').classList.remove('active-expanded-card') : null;
}