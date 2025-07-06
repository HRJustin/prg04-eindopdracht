export function getHighScore() {
    const score = parseInt(localStorage.getItem("highscore") || "0");
    console.log("Loaded high score from localStorage:", score);
    return score;
}

export function saveHighScore(score) {
    const currentHigh = getHighScore();
    console.log(`Trying to save high score. Current: ${currentHigh}, New: ${score}`);
    if (score > currentHigh) {
        localStorage.setItem("highscore", score.toString());
        console.log("High score updated!");
    } else {
        console.log("New score is not higher than current high score.");
    }
}