// import { question } from "readline-sync";

// import { Client } from "pg";
const { Client } = require("pg");
const { question } = require("readline-sync")


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
    const client = new Client({ database: 'omdb' });
    console.log("Welcome to search-movies-cli!");
    const userName = question('May I have your name? ');
    console.log('Hi ' + userName + '!');
    await client.connect();
    let searchTerm;
    while (searchTerm !== 'q') {
        searchTerm = question("Search for what movie?(or 'q' to quit): ");
        if (searchTerm === 'q') {
            console.log('Search ended');
            await client.end()
        } else {
            console.log('Searching ' + searchTerm + '...');
            const text = 'SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count from movies WHERE name iLIKE $1 AND kind = \'movie\' ORDER BY date DESC LIMIT 10 '
            const values = [`%${searchTerm}%`];
            const result = await client.query(text, values)
            console.table(result.rows)
        }
    }
    await client.end()
}

searchMovies();