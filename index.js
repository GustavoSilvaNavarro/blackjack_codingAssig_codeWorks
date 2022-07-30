$(document).ready(function() {
    //SELECTS
    const welcomeForm = $('#submitPlayersName');
    const inputPlayerName = $('#playerNameInput');
    const validationField = $('#validateField');
    const welcomeContainer = $('#containerWelcome');
    const gameContainer = $('#blackjackGame');
    const playerName = $('.playerName');
    const statusGame = $('#statusGame');
    const playerCardAmount = $('#playerCardAmount');
    const dealerCardAmount = $('#dealerCardAmount');
    const playerGameBoard = $('#playerGameBoard');
    const dealerGameBoard = $('#dealerGameBoard');
    const winsDisplay = $('#playerWins');
    const loosesDisplay = $('#playerLooses');
    const drawsDisplay = $('#playerDraws');
    const hitButton = $('#boardHitButton');
    const standButton = $('#boardStandButton');
    const dealButton = $('#boardDealButton');

    //INITIAL CONDITIONS OF THE GAME
    class BlackjackGame {
        constructor() {
            this.wins = 0;
            this.looses = 0;
            this.draws = 0;
            this.isPlaying = true;
            this.isStand = false;
            this.turnIsOver = false;
        };

        static cardIdentifiers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        static cardValues = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]};

        pickACard = () => BlackjackGame.cardIdentifiers[Math.floor(Math.random() * 13)];
    };

    //PLAYERS
    class Player {
        constructor(cardAmount, board) {
            this.cardAmount = cardAmount;
            this.board = board;
            this.score = 0;
        };
    };

    const game = new BlackjackGame();
    const userPlayer = new Player(playerCardAmount, playerGameBoard);
    const dealerPlayer = new Player(dealerCardAmount, dealerGameBoard);

    welcomeForm.on('submit', function(e) {
        e.preventDefault();

        const expReg = /^[a-zA-Z\s]{3,60}$/;
        if(expReg.test(inputPlayerName.val())) {
            welcomeContainer.addClass('removeContainer');
            gameContainer.removeClass('removeContainer');
            playerName.text(inputPlayerName.val().trim());
        } else {
            validationField.removeClass('hideElement');
            validationField.addClass('showElement');
        };
    });

    // Show Cards
    const showCard = (currentPlayer, card) => {
        if(currentPlayer.score <= 21) currentPlayer.board.append(`<img src="./public/cards/${card}.jpg" alt="${card}" />`);
    };

    //Update the score
    const updateScore = (currentPlayer, card) => {
        if(currentPlayer.score <= 21) {
            if(card === 'A') {
                if(currentPlayer.score + BlackjackGame.cardValues[card][1] <= 21) {
                    currentPlayer.score += BlackjackGame.cardValues[card][1];
                    if(currentPlayer.score < 10) {
                        currentPlayer.cardAmount.text(`0${currentPlayer.score}`);
                    } else {
                        currentPlayer.cardAmount.text(currentPlayer.score.toString());
                    };
                } else {
                    currentPlayer.score += BlackjackGame.cardValues[card][0];
                    if(currentPlayer.score < 10) {
                        currentPlayer.cardAmount.text(`0${currentPlayer.score}`);
                    } else {
                        currentPlayer.cardAmount.text(currentPlayer.score.toString());
                    };
                }
            } else {
                currentPlayer.score += BlackjackGame.cardValues[card];
                if(currentPlayer.score < 10) {
                    currentPlayer.cardAmount.text(`0${currentPlayer.score}`);
                } else {
                    currentPlayer.cardAmount.text(currentPlayer.score.toString());
                };
            };
        };
    };

    //FIRST CARDS TO SHOW UP
    const firstGame = (user, numberOfCards) => {
        let i = 0;
        while(i < numberOfCards) {
            const card = game.pickACard();
            showCard(user, card);
            updateScore(user, card);
            i++;
        };
    };

    firstGame(userPlayer, 2);
    firstGame(dealerPlayer, 1);

    //HIT BUTTON FUNCTIONALITY
    hitButton.click(() => {
        console.log('Presione click');
    });
});