let base_url = "https://api.football-data.org/v2/";
let league_id = 2014;
let api_key = "9d806601c2d5461d890d88b6178673a7";
let endpoint_teams = `${base_url}competitions/${league_id}/teams`;
let endpoint_standings = `${base_url}competitions/${league_id}/standings?standingType=TOTAL`;

function Api(url) {
   return fetch(url, {
      headers: {
         "X-Auth-Token": api_key
      }
   });
}

function status(response) {
   if (response.status !== 200) {
      console.log("Error : " + response.status);
      return Promise.reject(new Error(response.statusText));
   } else {
      return Promise.resolve(response);
   }
}

function json(response) {
   return response.json();
}

function error(error) {
   console.log("Error : " + error);
}

let tim;

function getAllTeams() {
   if ("caches" in window) {
      caches.match(endpoint_teams).then(response => {
         if (response) {
            response.json().then(data => {
               tim = data;
               showAllTeams(data);
            });
         }
      });
   }

   loading();
   Api(endpoint_teams)
      .then(status)
      .then(json)
      .then(data => {
         tim = data;
         showAllTeams(data);
      })
      .catch(error);
}

function showAllTeams(data) {
   let ligaHtml = "";
   data.teams.forEach(team => {
      ligaHtml += `
      <div class="col s12 m4 l4">
         <div class="card hoverable" style="height:300px">
            <div class="card-image">
               <div class="container">
                  <img height="150px" width="300px" src="${team.crestUrl}" alt="picture_liga">
               </div>
               <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="saveTeam(${team.id})"><i class="material-icons">add</i></a>
            </div>
            <div class="card-content">
            <span class="card-title purple-text darken-4 center">${team.name}</span>
               <p class="center">${team.venue}</p>
            </div>
         </div>
      </div>
      `;
   });
   document.getElementById("teams").innerHTML = ligaHtml;
   stopLoading();
}

function getAllKlasemen() {
   if ("caches" in window) {
      caches.match(endpoint_standings).then(response => {
         if (response) {
            response.json().then(data => {
               showAllKlasemen(data);
            });
         }
      });
   }
   loading();
   Api(endpoint_standings)
      .then(status)
      .then(json)
      .then(data => {
         showAllKlasemen(data);
      })
      .catch(error);
}

function showAllKlasemen(data) {
   let klasemenHtml = "";
   data.standings.forEach(standing => {
      let row = "";
      standing.table.forEach(result => {
         row += `
            <tr>
               <td class="center">${result.position}</td>
               <td class="valign-wrapper"><img class="responsive-img" alt="picture_teams" width="24" height="24" src="${result.team.crestUrl}"> &nbsp; &nbsp; ${result.team.name}</td>
               <td class="center">${result.playedGames}</td>
               <td class="center">${result.won}</td>
               <td class="center">${result.draw}</td>
               <td class="center">${result.lost}</td>
               <td class="center">${result.points}</td>
            </tr>
         `;
      });

      klasemenHtml += `
         <div class="col s12 m12">
            <div class="card hoverable">
               <div class="card-content">
                  <table class="responsive-table highlight centered">
                  <thead>
                     <tr>
                        <th class="center">Posisi</th>
                        <th>Daftar Tim</th>
                        <th class="center">Banyak permainan</th>
                        <th class="center">Menang</th>
                        <th class="center">Draw</th>
                        <th class="center">Kalah</th>
                        <th class="center">Point</th>
                     </tr>
                  </thead>
                  <tbody>` + row + `</tbody>
                  </table>
               </div>
            </div>
         </div>
      `;
   });
   document.getElementById("klasemen").innerHTML = klasemenHtml;
   stopLoading();
}

function getAllFavorite() {
   loading();
   queryGetAllTeam().then(teams => {
      showAllFavorite(teams);
   });
}

function showAllFavorite(data) {
   let favoriteHtml = "";
   data.forEach(team => {
      favoriteHtml += `
         <div class="col s12 m4 l4">
            <div class="card hoverable" style="height:300px">
               <div class="card-image">
                  <div class="container">
                     <img height="150px" width="300px" src="${team.crestUrl}" alt="favorite">
                  </div>
                  <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="deleteTeam(${team.id})"><i class="material-icons">delete</i></a>
               </div>
               <div class="card-content">
                  <span class="card-title purple-text darken-4 center">${team.name}</span>
                  <p class="center">${team.venue}</p>
               </div>
            </div>
         </div>
      `;
   });
   if (data.length == 0) {
      favoriteHtml += `<div class="card-panel grey darken-4" style="height:200px"><h5 class="center-align white-text">Team Favorite Belom ditambahkan!</h5></div>`;
   }
   document.getElementById("favorite").innerHTML = favoriteHtml;
   stopLoading();
}

function saveTeam(teamId) {
   let team = tim.teams.filter(data => data.id == teamId)[0];
   insertTeam(team).then(() => {
      M.toast({
         html: `${team.name} Tersimpan!`
      });
   });
}

function deleteTeam(teamId) {
   let x = confirm("Apakah anda ingin menghapus data?");
   if (x === true) {
      queryDelete(teamId).then(() => {
         M.toast({
            html: `Team Berhasil dihapus!`
         });
         getAllFavorite();
      })
   }
}

function loading() {
   const html = `
      <div class="preloader-wrapper big active">
         <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>
      </div>
   `;
   document.getElementById("preloader").innerHTML = html;
}

function stopLoading() {
   document.getElementById("preloader").innerHTML = "";
}