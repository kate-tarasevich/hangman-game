document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.querySelector('.quiz__question');
    const wordElement = document.querySelector('.quiz__word');
    const incorrectElement = document.querySelector('.quiz__incorrect');
    const keyboardElement = document.querySelector('.quiz__keyboard');
    const modal = document.querySelector('.modal');
    const modalMessage = document.querySelector('.modal__message');
    const modalWord = document.querySelector('.modal__word');
    const playAgainBtn = document.querySelector('.modal__play-again');
  

    const words = [
        { question: 'What is the capital of France?', answer: 'paris' },
        { question: 'Which planet is known as the Red Planet?', answer: 'mars' },
        { question: 'What is the capital of Portugal?', answer: 'lisbon' },
        { question: 'Which country produces the most coffee in the world?', answer: 'brazil' },
        { question: 'What soft drink was the first to be taken into space?', answer: 'cola' },
        { question: 'What is the strongest house in “The Three Little Pigs” made of?', answer: 'Brick' },
    ];

    let currentWordIndex = -1;
    let incorrectGuesses = 0;
    let guessedLetters = [];

    const resetGame = () => {
        modal.style.display = 'none';
        currentWordIndex = Math.floor(Math.random() * words.length);
        incorrectGuesses = 0;
        guessedLetters = [];
        updateUI();
    };

    const updateUI = () => {
        const currentWord = words[currentWordIndex].answer;
        const displayedWord = currentWord
            .split('')
            .map(letter => (guessedLetters.includes(letter) || letter === ' ' ? letter : '_'))
            .join(' ');

        questionElement.textContent = `Question: ${words[currentWordIndex].question}`;
        wordElement.textContent = `Word: ${displayedWord}`;
        incorrectElement.textContent = `Incorrect Guesses: ${incorrectGuesses}/6`;

        updateGallows();

        if (displayedWord.replace(/ /g, '') === currentWord.replace(/ /g, '')) {
            showModal('Congratulations! You won!', currentWord);
        } else if (incorrectGuesses === 6) {
            showModal('Oops! You lost. Try again!', currentWord);
        }

        renderKeyboard();
    };

    const handleGuess = (letter, button) => {
        const currentWord = words[currentWordIndex].answer.toLowerCase();
    
        if (currentWord.includes(letter.toLowerCase())) {
            guessedLetters.push(letter.toLowerCase());
        } else {
            incorrectGuesses += 1;
            guessedLetters.push(letter.toLowerCase());
        }
    
        updateUI();
    };
    

    document.addEventListener('keydown', event => {
        const keyPressed = event.key.toLowerCase();
        if (/^[a-z]$/.test(keyPressed)) {
            const button = document.querySelector(`.keyboard__key[data-letter="${keyPressed}"]`);
            handleGuess(keyPressed, button);
        }
    });

    const updateGallows = () => {
        const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

        parts.forEach((part, index) => {
            const partElement = document.querySelector(`.gallows__${part}`);
            partElement.style.display = index < incorrectGuesses ? 'block' : 'none';
        });
    };

    const renderKeyboard = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        keyboardElement.innerHTML = '';

        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.dataset.letter = letter; 
            button.addEventListener('click', () => handleGuess(letter, button));
            button.disabled = guessedLetters.includes(letter);
            button.classList.add('keyboard__key');

            if (guessedLetters.includes(letter)) {
                button.classList.add('guessed');
            }

            keyboardElement.appendChild(button);
        });
    };
    

    const showModal = (message, correctWord) => {
        modalMessage.textContent = message;

        if (message.includes('Congratulations')) {
            modalWord.textContent = `The correct word was: ${correctWord}.`;
        } else {
            modalWord.textContent = `The correct word was: ${correctWord}`;
        }

        modal.style.display = 'flex';
    };

    playAgainBtn.addEventListener('click', resetGame);

    resetGame();
});
