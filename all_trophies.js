let autoScrollInterval; // Variable para almacenar el identificador del intervalo

function getAllTrophies(url) {
    const additional_info = document.getElementById("additional_info");
    additional_info.innerHTML =`
        <div class="row" style="margin-bottom: 10px;">
            <div class="col-12">
                <h3>Lista de trofeos:</h3>
            </div>
            <div class="col-12 trophy" id="trophy"></div>
            <div class="col-12" id="state" style="margin-top: 10px;">
                <h5>En progreso...</h5>
            </div>
        </div> `
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const trophy = document.getElementById("trophy");
            const state_container = document.getElementById("state");
            const achievements = Object.values(data.Achievements); // Convertir el objeto en un array
            trophy.innerHTML = ""; // Limpiar contenido previo

            let state = "none";
            let allColored = true;
            const coloredTrophies = [];
            const grayscaleTrophies = [];

            achievements.forEach(element => {
                const img = document.createElement("img");
                img.src = `https://retroachievements.org/Badge/${element.BadgeName}.png`;
                img.alt = element.Title;
                if (!element.DateEarned) {
                    img.classList.add('grayscale');
                    allColored = false;
                    grayscaleTrophies.push(img);
                } else {
                    if (element.type == "win_condition") {
                        state = "beaten";
                    }
                    coloredTrophies.push(img);
                }
            });

            // Agregar trofeos en color primero
            coloredTrophies.forEach(img => trophy.appendChild(img));
            // Agregar trofeos en blanco y negro después
            grayscaleTrophies.forEach(img => trophy.appendChild(img));

            // Verificar condiciones
            if (allColored) {
                state = "mastered";
            }

            switch(state){
                case "mastered":
                    state_container.textContent = "⭐ Mastered";
                    state_container.style.color = "rgb(252, 199, 28)";
                    break;
                case "beaten":
                    state_container.textContent = "🏆 Beaten - En progreso...";
                    state_container.style.color = "rgb(252, 199, 28)";
                    break;
                default:
                    state_container.textContent = "En progreso...";
            }

            console.log("Estado de los trofeos:", state);

            // Iniciar autoscroll
            startAutoScroll();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function startAutoScroll() {
    const trophyDiv = document.getElementById('trophy');
    
    // Limpiar cualquier intervalo previo
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }

    function autoScroll() {
        trophyDiv.scrollTop += 1;
        if (trophyDiv.scrollTop >= trophyDiv.scrollHeight - trophyDiv.clientHeight) {
            trophyDiv.classList.add('fade-out');
            setTimeout(() => {
                trophyDiv.scrollTop = 0;
                trophyDiv.classList.remove('fade-out');
                trophyDiv.classList.add('fade-in');
                setTimeout(() => {
                    trophyDiv.classList.remove('fade-in');
                }, 1000); // Duración del fade-in
            }, 1000); // Duración del fade-out
        }
    }

    autoScrollInterval = setInterval(autoScroll, 50); // Ajusta el intervalo según la velocidad deseada
}