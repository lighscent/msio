const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();


const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
    if (err) {
        console.error('Erreur lors de la création de la base de données', err);
    } else {
        console.log('Base de données créée avec succès');
    }
});


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS containers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_name TEXT NOT NULL,
    setup_date TEXT NOT NULL,
    last_start_date TEXT NOT NULL,
    package_manager TEXT CHECK(package_manager IN ('npm', 'yarn')) NOT NULL
  )`, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table', err);
        } else {
            // console.log('Table créée avec succès');
        }
    });
});


function addContainer(containerName, packageManager) {
    const currentDate = new Date().toISOString();
    db.run(`INSERT INTO containers (container_name, setup_date, last_start_date, package_manager) VALUES (?, ?, ?, ?)`, [containerName, currentDate, currentDate, packageManager], function (err) {
        if (err) {
            console.error('Erreur lors de l\'ajout d\'un nouveau container', err);
        } else {
            console.log(`Container ajouté avec succès avec l'ID ${this.lastID}`);
        }
    });
}


function updateLastStartDate(containerId) {
    const currentDate = new Date().toISOString();
    db.run(`UPDATE containers SET last_start_date = ? WHERE id = ?`, [currentDate, containerId], function (err) {
        if (err) {
            console.error('Erreur lors de la mise à jour de la date de dernier démarrage', err);
        } else {
            console.log(`Date de dernier démarrage mise à jour pour le container ID ${containerId}`);
        }
    });
}


db.close((err) => {
    if (err) {
        console.error('Erreur lors de la fermeture de la base de données', err);
    } else {
        // console.log('Connexion à la base de données fermée');
    }
});


// addContainer('monContainer', 'npm');
// updateLastStartDate(1);
module.exports = {
    addContainer,
    updateLastStartDate
};