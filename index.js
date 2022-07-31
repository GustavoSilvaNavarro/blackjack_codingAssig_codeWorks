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
    const matchStatusPlayer = $('#matchStatusPlayer');
    const matchStatusDealer = $('#matchStatusDealer');

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
        constructor(cardAmount, board, matchStatus) {
            this.cardAmount = cardAmount;
            this.board = board;
            this.score = 0;
            this.isBlackJack = false;
            this.matchStatus = matchStatus;
        };
    };

    const game = new BlackjackGame();
    const userPlayer = new Player(playerCardAmount, playerGameBoard, matchStatusPlayer);
    const dealerPlayer = new Player(dealerCardAmount, dealerGameBoard, matchStatusDealer);

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
                    if(currentPlayer.score > 21) {
                        currentPlayer.cardAmount.addClass('removeContainer');
                        if(currentPlayer.isBlackJack) {
                            currentPlayer.isBlackJack = false;
                            currentPlayer.matchStatus.text('Bust!');
                            currentPlayer.matchStatus.removeClass('blackjackPlayer');
                            currentPlayer.matchStatus.addClass('bustPlayer');
                        } else {
                            currentPlayer.matchStatus.removeClass('removeContainer');
                            currentPlayer.matchStatus.text('Bust!');
                            currentPlayer.matchStatus.addClass('bustPlayer')
                        };
                    } else {
                        if(currentPlayer.score < 10) {
                            currentPlayer.cardAmount.text(`0${currentPlayer.score}`);
                        } else {
                            currentPlayer.cardAmount.text(currentPlayer.score.toString());
                        };
                    };
                };
            } else {
                currentPlayer.score += BlackjackGame.cardValues[card];
                if(currentPlayer.score > 21) {
                    currentPlayer.cardAmount.addClass('removeContainer');
                    if(currentPlayer.isBlackJack) {
                        currentPlayer.isBlackJack = false;
                        currentPlayer.matchStatus.text('Bust!');
                        currentPlayer.matchStatus.removeClass('blackjackPlayer');
                        currentPlayer.matchStatus.addClass('bustPlayer');
                    } else {
                        currentPlayer.matchStatus.removeClass('removeContainer');
                        currentPlayer.matchStatus.text('Bust!');
                        currentPlayer.matchStatus.addClass('bustPlayer')
                    };
                } else {
                    if(currentPlayer.score < 10) {
                        currentPlayer.cardAmount.text(`0${currentPlayer.score}`);
                    } else {
                        currentPlayer.cardAmount.text(currentPlayer.score.toString());
                    };    
                };
            };
        };
    };

    //GET GAME RESULT
    const getResult = () => {
        if(game.isPlaying && !game.turnIsOver) {
            if(userPlayer.score > 21) {
                statusGame.text('You Lost!');
                statusGame.css('color', '#c1121f');
                hitButton.prop('disabled', true);
                standButton.prop('disabled', true);
                dealButton.prop('disabled', false);
                game.isPlaying = false;
                game.turnIsOver = true;
                game.looses++;
                if(game.looses < 10) {
                    loosesDisplay.text(`0${game.looses}`);
                } else {
                    loosesDisplay.text(game.looses);
                };
            } else {
                if((userPlayer.score > dealerPlayer.score) || (dealerPlayer.score > 21)) {
                    game.wins++;
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    statusGame.text('You Won!');
                    statusGame.css('color', '#008000');
                    if(game.wins < 10) {
                        winsDisplay.text(`0${game.wins}`);
                    } else {
                        winsDisplay.text(game.wins);
                    };
                    dealButton.prop('disabled', false);
                };

                if(userPlayer.score === dealerPlayer.score) {
                    game.draws++;
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    statusGame.text('You Drew!');
                    statusGame.css('color', '#fca311');
                    if(game.draws < 10) {
                        drawsDisplay.text(`0${game.draws}`);
                    } else {
                        drawsDisplay.text(game.draws);
                    };
                    dealButton.prop('disabled', false);
                };

                if((dealerPlayer.score <= 21) && (dealerPlayer.score > userPlayer.score)) {
                    statusGame.text('You Lost!');
                    statusGame.css('color', '#c1121f');
                    dealButton.prop('disabled', false);
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    game.looses++;
                    if(game.looses < 10) {
                        loosesDisplay.text(`0${game.looses}`);
                    } else {
                        loosesDisplay.text(game.looses);
                    };
                };
            };
        };
    };

    //PIECE OF CODE GOT IT FROM https://www.delftstack.com/howto/javascript/javascript-wait-for-x-seconds/, generates a delay to wait x seconds in javascript
    const delay = time => new Promise(resolve => setTimeout(resolve, time));

    //FIRST CARDS TO SHOW UP
    const firstGame = (user, numberOfCards) => {
        if(!game.turnIsOver && game.isPlaying) {
            let i = 0;
            while(i < numberOfCards) {
                const card = game.pickACard();
                showCard(user, card);
                updateScore(user, card);
                i++;
            };

            if(user.score === 21) {
                user.isBlackJack = true;
                user.matchStatus.removeClass('removeContainer');
                user.matchStatus.addClass('blackjackPlayer');
            };
        };
    };

    firstGame(userPlayer, 2);
    firstGame(dealerPlayer, 1);

    //HIT BUTTON FUNCTIONALITY
    hitButton.click(() => {
        if(game.isPlaying && !game.isStand && !game.turnIsOver) {
            statusGame.text('Playing...');
            const newCard = game.pickACard();
            showCard(userPlayer, newCard);
            updateScore(userPlayer, newCard);

            if(userPlayer.score > 21) {
                getResult();
            };
        };
    });

    //DEALER PLAYS
    standButton.click(async () => {
        hitButton.prop('disabled', true);
        standButton.prop('disabled', true);
        if(game.isPlaying && !game.turnIsOver && !game.isStand) {
            game.isStand = true;
            while(dealerPlayer.score <= 16) {
                const newDealerCard = game.pickACard();
                showCard(dealerPlayer, newDealerCard);
                updateScore(dealerPlayer, newDealerCard);
                if(dealerPlayer.board[0].childElementCount === 2 && dealerPlayer.score === 21) {
                    dealerPlayer.isBlackJack = true;
                    dealerPlayer.matchStatus.removeClass('removeContainer');
                    dealerPlayer.matchStatus.addClass('blackjackDealer');
                };

                await delay(1000);
            };

            getResult();
        };
    });


    //RESTART GAME
    dealButton.click(() => {
        console.log('Puedo Presionar boton');
    });


});