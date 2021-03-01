const http = require('http');
const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const db = require('./db');
const radLogger = require('./radLogger');
const bodyParser = require('body-parser');
// const checkIfAwesome = require('./awesomeCheck')


const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.engine('html', es6Renderer) // register html template engine
app.set('views', 'templates') // look for templates in the 'templates' folder
app.set('view engine', 'html') // use the html engine for view rendering

const server = http.createServer(app);

app.use(radLogger)
// app.use(checkIfAwesome)

// static files
app.use(express.static('public')) // look in 'public' for any files get requested

// parse JSON data
app.use(bodyParser.json())

// parse Form Data
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('home', {
        locals: {
            title: 'Super Heroes Address Book'
        },
        partials: {
            head: '/partials/head'
        }
    });
})

// app.get('/cats', (req, res) => {
//     res.send('Meow!');
// })

// app.get('/dogs', (req,res) => {
//     res.send('Woof!');
// })

// app.get('/cats_and_dogs', (req, res) => {
//     res.send("Dogs and cats living together...mass hysteria!!")
// })

// app.get('/greet/:name', (req, res) => {
//     res.send('Hello, ' + req.params.name + '!')
// })

app.get('/friends', (req, res) => {
    let html = ''
    db.forEach(friend => {
        html += `<li>${friend.name}</li>`
    })

    res.render('friends', {
        locals: {
            title: 'Friends List',
            friends: db
        },
        partials: {
            head: '/partials/head'
        }
    })
})

app.get('/friends/:handle', (req, res) => {
    console.log(req.params.handle)

    const foundFriend = db.find((friend) => {
        if (friend.handle === req.params.handle) {
            return true
        } else {
            return false
        }
    })

    if (foundFriend) {
        res.render('friendSingle', {
            locals: {
                title: "Friend Single",
                friend: foundFriend
            },
            partials: {
                head: '/partials/head'
            }
        })
    } else {
        res.status(404)
        res.send("Could not find user with that handle")
    }

    // res.send(foundFriend.name)
})

app.get('*', (req, res) => {
    res.status(404);
    res.send('Page not found');
})

server.listen(port, hostname, () => {
    console.log(`Server Running at http://${hostname}:${port}/`);
})