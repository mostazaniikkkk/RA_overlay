const params = new URLSearchParams(window.location.search);

// Parámetros
const username = params.get('user');
const key = params.get('key');

const ra_url = "https://retroachievements.org/API";

function loop_func() {
    fetch(`${ra_url}/API_GetUserSummary.php?u=${username}&y=${key}&g=1&a=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("username").textContent = data.User;
            document.getElementById("icon").src = `https://retroachievements.org${data.UserPic}`;
            document.getElementById("score").textContent = `Score: ${data.TotalPoints}`;
            document.getElementById("rich").textContent = `Dato Rich: ${data.RichPresenceMsg}`;

            
            const recentGame = data.RecentlyPlayed[0];
            //document.getElementById("game_title").textContent = recentGame.Title;
            //document.getElementById("game_icon").src = `https://retroachievements.org${recentGame.ImageIcon}`;

            const recentAchievement = data.RecentAchievements[recentGame.GameID];
            const firstAchievement = Object.values(recentAchievement)[0];
            document.getElementById("trophee_icon").src = `https://retroachievements.org/Badge/${firstAchievement.BadgeName}.png`;
            document.getElementById("trophee_title").textContent = firstAchievement.Title;
            document.getElementById("trophee_desc").textContent = firstAchievement.Description;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

loop_func();
setInterval(loop_func, 10000);
