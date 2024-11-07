function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
}

loadScript("./get_last_trophy.js")
loadScript("./all_trophies.js")
loadScript("./user_data.js")

const params = new URLSearchParams(window.location.search);

// Parámetros
const username = params.get('user');
const key = params.get('key');
// Parámetros opcionales
const target_trophy = params.get('target'); // Trofeo objetivo
const perma_state = params.get('state'); // Estado permanente del widget, en caso de ser necesario
const transition_time = params.get('time'); // Tiempo de transición en segundos

const ra_url = "https://retroachievements.org/API";

let player_data = null;
let currentFunction = 0; // Variable para alternar entre funciones


async function fetchPlayerData() {
    try {
        const response = await fetch(`${ra_url}/API_GetUserSummary.php?u=${username}&y=${key}&g=1&a=1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        player_data = await response.json();

        // Actualizar información del usuario
        document.getElementById("username").textContent = player_data.User;
        document.getElementById("icon").src = `https://retroachievements.org${player_data.UserPic}`;

        // Calcular y mostrar el porcentaje de progreso
        const { NumPossibleAchievements, NumAchieved } = player_data.Awarded[player_data.RecentlyPlayed[0].GameID];
        const progressPercentage = ((NumAchieved / NumPossibleAchievements) * 100).toFixed(2) + '%';
        document.getElementById("score").textContent = `Score: ${player_data.TotalPoints} - Progreso: ${progressPercentage}`;

        console.log('Player data fetched successfully:', player_data);

        // Llamar a displayController después de obtener los datos por primera vez
        if (!displayControllerCalled) {
            displayController();
            displayControllerCalled = true;
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayController() {
    console.log('displayController called');
    const additionalInfo = document.getElementById('additional_info');

    if (player_data) {
        console.log('Player data is available:', player_data);

        // Aplicar efecto de fade-out
        additionalInfo.classList.remove('fade-in');
        additionalInfo.classList.add('fade-out');

        // Esperar a que termine el efecto de fade-out antes de actualizar el contenido
        setTimeout(() => {
            // Alternar entre las funciones disponibles
            switch (currentFunction) {
                case 0:
                    console.log('Llamar a la información del trofeo más reciente');
                    updateModules(player_data);
                    break;
                case 1:
                    console.log('Llamar a la función que muestra de forma global los trofeos del juego');
                    const gameId = player_data.RecentlyPlayed[0].GameID;
                    getAllTrophies(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?z=${username}&y=${key}&u=${username}&g=${gameId}&a=1`);
                    break;
                case 2:
                    console.log('Llamar a la función que muestra los datos del jugador');
                    userData(player_data, `${ra_url}/API_GetUserAwards.php?u=${username}&y=${key}`);
                    // Aquí iría la llamada a la función que muestra los datos del jugador
                    break;
                default:
                    console.log('Función no definida');
            }

            // Aplicar efecto de fade-in
            additionalInfo.classList.remove('fade-out');
            additionalInfo.classList.add('fade-in');

            // Actualizar el estado para la próxima llamada
            currentFunction = (currentFunction + 1) % 3;
        }, 1000); // Duración del efecto de fade-out
    } else {
        console.log('Player data is not available yet.');
    }
}

let displayControllerCalled = false;

// Ejecutar la función inmediatamente y luego cada 10 segundos
fetchPlayerData();
setInterval(fetchPlayerData, 10000);

// Alternar las funciones cada minuto en una corrutina separada
setInterval(displayController, 60000);