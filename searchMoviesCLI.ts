// import { question } from "readline-sync";

import { keyInSelect } from "readline-sync";

// import { Client } from "pg";
const { Client } = require("pg");
const { question } = require("readline-sync")


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
    const client = new Client({ database: 'omdb' });
    console.log("Welcome to search-movies-cli!");
    const action = question('what would you like to do? \n[1] search \n[2] see favourite \n[3] quit \n');

    if (action === '1') {
        console.log(`OK! Let's search!`)
        await client.connect();
        let searchTerm;
        while (searchTerm !== 'q') {
            searchTerm = question("Search for what movie?(or 'q' to quit): ");
            if (searchTerm === 'q') {
                await client.end();
                console.log('Search ended');
            } else {
                console.log('Searching ' + searchTerm + '...');
                const text = 'SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count from movies WHERE name iLIKE $1 AND kind = \'movie\' ORDER BY date DESC LIMIT 10 '
                const values = [`%${searchTerm}%`];
                const result = await client.query(text, values);
                console.table(result.rows);
            }
        }
        await client.end()

    } else if (action === '2') {
        console.log(`OK! Let's see favourite!`)
        await client.connect();
        const text = 'SELECT id, name from favourites LIMIT 10 '
        const result = await client.query(text)
        console.table(result.rows)
    } else {
        await client.end()
        console.log('Session ended');
    }

}


searchMovies();