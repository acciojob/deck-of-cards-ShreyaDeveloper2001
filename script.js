//your code here
document.addEventListener("DOMContentLoaded", function () {
  const cardContainers = document.querySelectorAll(".whitebox2");
  const cardHolders = document.querySelectorAll(".placed");
  const shuffleButton = document.getElementById("shuffle");
  const resetButton = document.getElementById("reset");
  const wonMessage = document.getElementById("won");

  // Load saved game state or initialize a new game
  let gameState = JSON.parse(localStorage.getItem("gameState")) || {
    shuffled: false,
    placedCards: [null, null, null, null],
  };

  // Initialize the game state
  function initializeGame() {
    for (let i = 0; i < cardContainers.length; i++) {
      const cardContainer = cardContainers[i];
      const cardId = cardContainer.id;
      const cardIndex = parseInt(cardId);

      cardContainer.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", cardIndex);
      });

      cardContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
      });

      cardContainer.addEventListener("drop", function (event) {
        const droppedCardIndex = parseInt(event.dataTransfer.getData("text/plain"));

        // Check if the card can be placed in the card holder
        if (canPlaceCard(cardIndex, droppedCardIndex)) {
          gameState.placedCards[cardIndex] = droppedCardIndex;
          updateGameState();
          updateCardContainers();
          checkWin();
        }
      });
    }

    updateCardContainers();
    checkWin();
  }

  // Check if the card can be placed in the card holder
  function canPlaceCard(cardIndex, droppedCardIndex) {
    const card = cardContainers[droppedCardIndex];
    const cardHolder = cardHolders[cardIndex];

    const cardSuit = card.querySelector("img").alt;
    const cardHolderSuit = cardHolder.querySelector("img").alt;

    return cardSuit === cardHolderSuit;
  }

  // Update the game state in local storage
  function updateGameState() {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }

  // Update the card containers based on the game state
  function updateCardContainers() {
    for (let i = 0; i < cardContainers.length; i++) {
      const cardContainer = cardContainers[i];
      const cardIndex = parseInt(cardContainer.id);

      if (gameState.placedCards[cardIndex] !== null) {
        cardContainer.classList.add("hide");
      } else {
        cardContainer.classList.remove("hide");
      }
    }

    for (let i = 0; i < cardHolders.length; i++) {
      const cardHolder = cardHolders[i];
      const cardIndex = gameState.placedCards[i];

      if (cardIndex !== null) {
        cardHolder.appendChild(cardContainers[cardIndex].querySelector("img"));
        cardContainers[cardIndex].classList.add("hide");
      }
    }
  }

  // Check if the player has won
  function checkWin() {
    if (gameState.placedCards.every(cardIndex => cardIndex !== null)) {
      wonMessage.style.display = "block";
    } else {
      wonMessage.style.display = "none";
    }
  }

  // Shuffle the cards
  shuffleButton.addEventListener("click", function () {
    // Reset the game state
    gameState = {
      shuffled: true,
      placedCards: [null, null, null, null],
    };

    updateGameState();
    updateCardContainers();
  });

  // Reset the game
  resetButton.addEventListener("click", function () {
    localStorage.removeItem("gameState");
    location.reload();
  });

  // Initialize the game
  initializeGame();
});

