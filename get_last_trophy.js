function updateModules(data) {
    // Crear y agregar módulos faltantes
    const additionalInfo = document.getElementById("additional_info");
    additionalInfo.innerHTML = `
        <div class="row">
            <div class="col-12">
                <h5 id="rich">${data.RichPresenceMsg}</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h3 class="trophee_title">Ultimo trofeo desbloqueado:</h3>
            </div>
        </div>
        <div class="row" style="margin-bottom: 10px;">
            <div class="col-3">
                <img id="trophee_icon" style="width: 100%;" alt="Icono">
            </div>
            <div class="col-9">
                <h3 class="trophee_title" id="trophee_title">Sin informacion</h3>
                <h5 id="trophee_desc">Sin informacion</h5>
            </div>
        </div>
    `;

    // Información del primer trofeo reciente
    const recentAchievement = data.RecentAchievements[data.RecentlyPlayed[0].GameID];
    const firstAchievement = Object.values(recentAchievement)[0];
    document.getElementById("trophee_icon").src = `https://retroachievements.org/Badge/${firstAchievement.BadgeName}.png`;
    document.getElementById("trophee_title").textContent = firstAchievement.Title;
    document.getElementById("trophee_desc").textContent = firstAchievement.Description;
}
