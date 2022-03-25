document.addEventListener("DOMContentLoaded", function() {
  fetch('https://api.quotable.io/random')
  .then(response => response.json())
  .then(data => {
    var prompt = data.content;
    const promptContainer = document.getElementById('prompt-div');
    const authorContainer = document.getElementById('author');

    var wordCount = prompt.split(' ').length;
    var letterElements = plugQuoteIntoDOM(promptContainer, prompt);

    authorContainer.innerHTML = `By: ${data.author}`;

    var input = document.getElementById('typer');
    var currentIdx = 0;
    var keyboardIdx = 0;
    var start = 0;

    input.addEventListener('input', (e) => {
      if (currentIdx === letterElements.length) {
        var elapsed_seconds = (Date.now() - start) / 1000;
        input.value = " "
        input.disabled = true;
        document.getElementById('time').innerHTML = `Your Time: ${elapsed_seconds} seconds, Average: ${(wordCount / (elapsed_seconds / 60)).toFixed(2)} words/minute`;
      } else {
        [currentIdx, wordstart, keyboardIdx] = updateGame(e.data, input, letterElements, currentIdx, keyboardIdx, true)
        input.setAttribute('data-idx', currentIdx)
      }
    });

    var newGameBtn = document.getElementById('new-game');
    newGameBtn.addEventListener('click', () => window.location.reload())

    var startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', (e) => {
      e.target.disabled = true;
      input.disabled = false;
      input.focus();
      start = Date.now();
    });
  })
});
  
// One by one injects each word from quote to the dom.
function plugQuoteIntoDOM (container, text) {
  let textArr = text.split('');
  for (let i in textArr) {
    const word = document.createElement('h6');
    word.setAttribute('id', `${i}`);
    word.setAttribute('class', 'letter')
    word.innerHTML = textArr[i];
    if (textArr[i] === " ") {
      word.style.width = '5px';
    }
    container.appendChild(word)
    textArr[i] = word;
  }
  return textArr;
}

function updateGame(input, inputElement, letterElements, currentIdx, keyboardIdx, wordstart) {
  var correct = letterElements[currentIdx].innerHTML;
  if (input === null && wordstart){
    return [currentIdx, wordstart, keyboardIdx - 1];
  } else if (input === null) {
    return [currentIdx, wordstart, keyboardIdx];
  } else if (input === " " && input === correct && currentIdx === keyboardIdx) {
    inputElement.value = "";
    letterElements[currentIdx].style.color = 'red';
    return [currentIdx + 1, true, keyboardIdx + 1];
  } else if (input === correct && currentIdx === keyboardIdx) {
    letterElements[currentIdx].style.color = 'red';
    return [currentIdx + 1, false, keyboardIdx + 1];
  } else {
    return [currentIdx, wordstart, keyboardIdx + 1];
  }
}
  
