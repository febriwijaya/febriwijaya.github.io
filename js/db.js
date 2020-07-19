const idbPromised = idb.open("db_bundesliga", 1, upgradeDb => {
   if (!upgradeDb.objectStoreNames.contains("teams")) {
      upgradeDb.createObjectStore("teams", {
         keyPath: "id"
      });
   }
});

function queryGetAllTeam() {
   return new Promise((resolve, reject) => {
      idbPromised.then(db => {
         const transaction = db.transaction("teams", "readonly");
         return transaction.objectStore("teams").getAll();
      }).then(data => {
         if (data !== undefined) {
            resolve(data);
         } else {
            reject(new Error("Favorite not found"));
         }
      })
   })
}

function insertTeam(team) {
   return new Promise((resolve, reject) => {
      idbPromised.then(db => {
         const transaction = db.transaction("teams", "readwrite");
         transaction.objectStore("teams").put(team);
         return transaction;
      }).then(transaction => {
         if (transaction.complete) {
            resolve(true);
         } else {
            reject(new Error(transaction.onerror));
         }
      })
   })
}

function queryDelete(teamId) {
   return new Promise((resolve, reject) => {
      idbPromised.then(db => {
         const transaction = db.transaction("teams", "readwrite");
         transaction.objectStore("teams").delete(teamId);
         return transaction;
      }).then(transaction => {
         if (transaction.complete) {
            resolve(true);
         } else {
            reject(new Error(transaction.onerror));
         }
      })
   })
}