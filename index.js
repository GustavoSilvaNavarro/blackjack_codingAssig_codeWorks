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
    const splitButton = $('#boardSplitButton');
    const hit2Button = $('#boardHit2Button');
    const playerGameBoard2 = $('#playerGameBoard2');
    const playerCardAmount2 = $('#playerCardAmountLowerHand');
    const matchStatusPlayer2 = $('#matchStatusPlayer2');

    let firstTwoCards = [];

    //INITIAL CONDITIONS OF THE GAME
    class BlackjackGame {
        constructor() {
            this.wins = 0;
            this.looses = 0;
            this.draws = 0;
            this.isPlaying = true;
            this.isStand = false;
            this.turnIsOver = false;
            this.isSplitMode = false;
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
    let userPlayer2;

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
                    statusGame.css('color', '#FB8500');
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

    const getResultforSplitModeBust = (activePlayer, isDealer) => {
        if(game.isPlaying && !game.turnIsOver && game.isSplitMode) {
            if(activePlayer.score > 21 && !isDealer) {
                game.looses++;
                activePlayer.matchStatus.text('You Lost!');

                if(game.looses < 10) {
                    loosesDisplay.text(`0${game.looses}`);
                } else {
                    loosesDisplay.text(game.looses);
                };

                if(userPlayer.score > 21 && userPlayer2.score > 21) {
                    game.turnIsOver = true;
                    game.isPlaying = false;
                    dealButton.prop('disabled', false);
                    statusGame.text('End of the Round');
                    hit2Button.addClass('removeContainer');
                    hit2Button.prop('disabled', true);
                    standButton.prop('disabled', true);
                };

                if(userPlayer.score > 21 && userPlayer2.score < 21) {
                    hitButton.prop('disabled', true);            
                };
            };
        };

        if(isDealer) {
            if(((userPlayer.score > dealerPlayer.score) && userPlayer.score <= 21) || (dealerPlayer.score > 21 && userPlayer.score <= 21)) {
                game.wins++;
                userPlayer.cardAmount.text('You Won!');
                if(game.wins < 10) {
                    winsDisplay.text(`0${game.wins}`);
                } else {
                    winsDisplay.text(game.wins);
                };
            };
    
            if(userPlayer.score === dealerPlayer.score) {
                game.draws++;
                userPlayer.cardAmount.text('You Drew!');
                if(game.draws < 10) {
                    drawsDisplay.text(`0${game.draws}`);
                } else {
                    drawsDisplay.text(game.draws);
                };
            };
    
            if((dealerPlayer.score <= 21) && (dealerPlayer.score > userPlayer.score) && userPlayer.score <= 21) {
                userPlayer.cardAmount.text('You Lost!');
                game.looses++;
                if(game.looses < 10) {
                    loosesDisplay.text(`0${game.looses}`);
                } else {
                    loosesDisplay.text(game.looses);
                };
            };

            if(((userPlayer2.score > dealerPlayer.score) && userPlayer2.score <= 21) || (dealerPlayer.score > 21 && userPlayer2.score <= 21)) {
                game.wins++;
                userPlayer2.cardAmount.text('You Won!');
                if(game.wins < 10) {
                    winsDisplay.text(`0${game.wins}`);
                } else {
                    winsDisplay.text(game.wins);
                };
            };
    
            if(userPlayer2.score === dealerPlayer.score) {
                game.draws++;
                userPlayer2.cardAmount.text('You Drew!');
                if(game.draws < 10) {
                    drawsDisplay.text(`0${game.draws}`);
                } else {
                    drawsDisplay.text(game.draws);
                };
            };
    
            if((dealerPlayer.score <= 21) && (dealerPlayer.score > userPlayer2.score) && userPlayer2.score <= 21) {
                userPlayer2.cardAmount.text('You Lost!');
                game.looses++;
                if(game.looses < 10) {
                    loosesDisplay.text(`0${game.looses}`);
                } else {
                    loosesDisplay.text(game.looses);
                };
            };

            dealButton.prop('disabled', false);
            game.isPlaying = false;
            game.turnIsOver = true;
            statusGame.text('End of the Round');
        };
    };

    const clearScoreBoard = (player) => {
        if(player.matchStatus.hasClass('bustPlayer')) {
            player.matchStatus.text('Blackjack');
            player.matchStatus.removeClass('bustPlayer');
            player.matchStatus.addClass('removeContainer');

            player.cardAmount.removeClass('removeContainer');
            player.cardAmount.text('00');
        } else {
            player.cardAmount.text('00');
        };

        if(player.matchStatus.hasClass('blackjackPlayer')) {
            player.matchStatus.removeClass('blackjackPlayer');
            player.matchStatus.addClass('removeContainer');

            player.cardAmount.text('00');
        } else {
            player.cardAmount.text('00');
        }
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
                firstTwoCards.push(card);
            };

            if(user.score === 21) {
                user.isBlackJack = true;
                user.matchStatus.removeClass('removeContainer');
                user.matchStatus.addClass('blackjackPlayer');
            };

            if(firstTwoCards.length > 1 && (BlackjackGame.cardValues[firstTwoCards[0]] === BlackjackGame.cardValues[firstTwoCards[1]]) && !game.isSplitMode) {
                splitButton.removeClass('removeContainer');
                splitButton.prop('disabled', false);
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

            if(!game.isSplitMode) {
                splitButton.prop('disabled', true);
                splitButton.addClass('removeContainer');
            };

            if(userPlayer.score > 21) {
                if(game.isSplitMode) {
                    getResultforSplitModeBust(userPlayer, false);
                } else {
                    getResult();
                };
            };
        };
    });

    //DEALER PLAYS
    standButton.click(async () => {
        if(!game.isSplitMode) {
            hitButton.prop('disabled', true);
        } else {
            hit2Button.addClass('removeContainer');
            hit2Button.prop('disabled', true);
        };
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
                    dealerPlayer.matchStatus.addClass('blackjackPlayer');
                };

                await delay(1000);
            };

            if(game.isSplitMode) {
                getResultforSplitModeBust(dealerPlayer, true);
            } else {
                getResult();
            };

            console.log(game);
        };
    });

    //RESTART GAME
    dealButton.click(() => {
        if(game.turnIsOver && !game.isPlaying && !game.isSplitMode) {
            dealButton.prop('disabled', true);
            const userImg = userPlayer.board.children('img');
            const dealerImg = dealerPlayer.board.children('img');

            for(let i = 0; i < userImg.length; i++) {
                userImg[i].remove();
            };

            for(let i = 0; i < dealerImg.length; i++) {
                dealerImg[i].remove();
            };

            userPlayer.score = 0;
            userPlayer.isBlackJack = false;
            dealerPlayer.score = 0;
            dealerPlayer.isBlackJack = false;

            game.isPlaying = true;
            game.turnIsOver = false;
            game.isStand = false;
            game.isSplitMode = false;

            firstTwoCards = [];

            statusGame.text("Let's Play");
            statusGame.css('color', '#003566');

            clearScoreBoard(userPlayer);
            clearScoreBoard(dealerPlayer);

            firstGame(userPlayer, 2);
            firstGame(dealerPlayer, 1);

            hitButton.prop('disabled', false);
            standButton.prop('disabled', false);
        } else {
            dealButton.prop('disabled', true);
            const userImg = userPlayer.board.children('img');
            const dealerImg = dealerPlayer.board.children('img');

            for(let i = 0; i < userImg.length; i++) {
                userImg[i].remove();
            };

            for(let i = 0; i < dealerImg.length; i++) {
                dealerImg[i].remove();
            };

            userPlayer.score = 0;
            userPlayer.isBlackJack = false;
            dealerPlayer.score = 0;
            dealerPlayer.isBlackJack = false;

            game.isPlaying = true;
            game.turnIsOver = false;
            game.isStand = false;
            game.isSplitMode = false;

            firstTwoCards = [];

            statusGame.text("Let's Play");
            statusGame.css('color', '#003566');

            clearScoreBoard(userPlayer);
            clearScoreBoard(dealerPlayer);

            const userImg2 = userPlayer2.board.children('img');

            for(let i = 0; i < userImg2.length; i++) {
                userImg2[i].remove();
            };

            clearScoreBoard(userPlayer2);
            userPlayer2.board.addClass('removeContainer');
            // userPlayer2.cardAmount.text('00');
            userPlayer2.cardAmount.addClass('removeContainer');
            userPlayer2.score = 0;
            userPlayer2.isBlackJack = false;

            firstGame(userPlayer, 2);
            firstGame(dealerPlayer, 1);

            hitButton.prop('disabled', false);
            standButton.prop('disabled', false);
        };
    });

    console.log(firstTwoCards);

    //SPLIT YOUR CARDS
    splitButton.click(() => {
        console.log('Separo Perro');
        if(!game.turnIsOver && !game.isStand && !game.isSplitMode) {
            game.isSplitMode = true;
            userPlayer2 = new Player(playerCardAmount2, playerGameBoard2, matchStatusPlayer2);

            userPlayer.board.children('img')[1].remove();
            userPlayer2.board.removeClass('removeContainer');
            userPlayer2.cardAmount.removeClass('removeContainer');
            userPlayer2.board.append(`<img src="./public/cards/${firstTwoCards[1]}.jpg" alt="${firstTwoCards[1]}" />`);
            if(firstTwoCards[0] === 'A' && firstTwoCards[1] === 'A') {
                userPlayer.score = BlackjackGame.cardValues[firstTwoCards[0]][1];
                userPlayer2.score = BlackjackGame.cardValues[firstTwoCards[1]][1];
            } else {
                userPlayer.score = BlackjackGame.cardValues[firstTwoCards[0]];
                userPlayer2.score = BlackjackGame.cardValues[firstTwoCards[1]];
            };

            if(userPlayer.score < 10) {
                userPlayer.cardAmount.text(`0${userPlayer.score}`);
            } else {
                userPlayer.cardAmount.text(userPlayer.score.toString());
            };

            if(userPlayer2.score < 10) {
                userPlayer2.cardAmount.text(`0${userPlayer2.score}`);
            } else {
                userPlayer2.cardAmount.text(userPlayer2.score.toString());
            };

            splitButton.prop('disabled', true);
            splitButton.addClass('removeContainer');

            hit2Button.removeClass('removeContainer');
            hit2Button.prop('disabled', false);
        };
    });

    hit2Button.click(() => {
        if(game.isPlaying && !game.isStand && !game.turnIsOver) {
            statusGame.text('Playing...');
            hitButton.prop('disabled', true); 
            const newCard2 = game.pickACard();
            showCard(userPlayer2, newCard2);
            updateScore(userPlayer2, newCard2);

            if(userPlayer2.score > 21) {
                getResultforSplitModeBust(userPlayer2, false);
            };

            console.log(game);
            console.log(userPlayer);
            console.log(dealerPlayer);
            console.log(userPlayer2);
        };
    });
});