document.addEventListener('DOMContentLoaded', () => {
  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const turnEl = document.getElementById('currentPlayer');
  const undoBtn = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const overlay = document.getElementById('resultOverlay');
  const resultMessage = document.getElementById('resultMessage');
  const xScoreEl = document.getElementById('xScore');
  const oScoreEl = document.getElementById('oScore');
  const tieScoreEl = document.getElementById('tieScore');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let running = true;
  let moveHistory = [];
  let scores = {X:0, O:0, T:0};

  function init() {
    board.fill(null);
    cells.forEach(c => {
      c.textContent = '';
      c.className = 'cell';
      c.addEventListener('click', onCellClick);
    });
    running = true;
    currentPlayer = 'X';
    moveHistory = [];
    statusEl.textContent = 'Tap any cell to start';
    turnEl.textContent = currentPlayer;
    undoBtn.disabled = true;
    overlay.classList.add('hidden');
  }

  function onCellClick(e) {
    const idx = +e.target.dataset.index;
    if (!running || board[idx]) return;
    board[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    moveHistory.push({index: idx, player: currentPlayer});
    undoBtn.disabled = false;
    checkWinner();
    if (running) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnEl.textContent = currentPlayer;
    }
  }

  function checkWinner() {
    for (const combo of WIN_COMBOS) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        combo.forEach(i => cells[i].classList.add('win'));
        scores[board[a]]++;
        showResult(`Player ${board[a]} Wins!`);
        updateScores();
        running = false;
        return;
      }
    }
    if (board.every(c => c)) {
      scores.T++;
      showResult("It's a Draw!");
      updateScores();
      running = false;
    }
  }

  function showResult(message) {
    resultMessage.textContent = message;
    overlay.classList.remove('hidden');
  }

  function updateScores() {
    xScoreEl.textContent = scores.X;
    oScoreEl.textContent = scores.O;
    tieScoreEl.textContent = scores.T;
  }

  undoBtn.addEventListener('click', () => {
    const last = moveHistory.pop();
    if (!last) return;
    board[last.index] = null;
    const cell = cells[last.index];
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'win');
    currentPlayer = last.player;
    turnEl.textContent = currentPlayer;
    running = true;
    undoBtn.disabled = moveHistory.length === 0;
  });

  resetBtn.addEventListener('click', init);
  newGameBtn.addEventListener('click', init);

  init();
});
