const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const mySQLString = process.env.CLEARDB_DATABASE_URL;
const database = new Prohairesis(mySQLString);


// basic rest api

app
    .use(morgan('dev'))
    .use(express.static('public'))

    .use(bodyParser.urlencoded({ extended: false}))
    .use(bodyParser.json())




    .post('/api/user', async (req, res) => {
        const body = req.body;

        await database.execute(`
            INSERT INTO user (
                first_name,
                last_name,
                age,
                date_added
            ) VALUES (
                @firstName,
                @lastName,
                @age,
                NOW()
            )
        
        `, {
            firstName: body.first,
            lastName: body.last,
            age: body.age,

        })
        
        res.end('Added User');
    })

    .listen(port, () => console.log('Server listening'));