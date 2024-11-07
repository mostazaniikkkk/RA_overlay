function userData(data, url){
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(rank_data => {
    const additionalInfo = document.getElementById("additional_info");
    additionalInfo.innerHTML = `
    <div class="row">
        <div class="col-12"> 
        <h5>Informacion del jugador:</h5> 
        </div>
        <div class="col-6"> 
        <p class="info"><b class="points" id="points">Puntos:</b></p> 
        </div>
        <div class="col-6"> 
        <p class="info"><b class="points" id="ranking">Ranking:</b></p> 
        </div>
        <div class="col-6"> 
        <p class="info"><b class="points" id="beaten_games">Beaten:</b></p> 
        </div>
        <div class="col-6"> 
        <p class="info"><b class="points" id="mastered_games">Mastered:</b></p> 
        </div>
        <div class="col-12"> 
        <p class="info"><b class="points" id="register">Fecha registro:</b></p> 
        </div>
        <div class="col-12"> 
        <p class="info"><b class="points" id="bio"></b></p> 
        </div>
    </div> `

    document.getElementById("points").textContent = `Puntos 📋: ${data.TotalPoints}`;
    document.getElementById("ranking").textContent = `Ranking 📊: #${data.Rank}`;
    document.getElementById("beaten_games").textContent = `Beaten 🏆: ${rank_data.BeatenHardcoreAwardsCount}`;
    document.getElementById("mastered_games").textContent = `Mastered ⭐: ${rank_data.MasteryAwardsCount}`;
    document.getElementById("register").textContent = `Fecha Registro 🗓️: ${data.MemberSince}`;
    if(data.Motto != ""){ document.getElementById("bio").textContent = `Bio 📝: ${data.Motto}`; }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}