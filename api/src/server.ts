import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.json({ message: "NLW04"})
})

app.post('/', (req, res) => {
    return res.json({ message: "NLW04"})
})

app.listen(3333, () => {
    console.log(`Server Running in port 3333::\nhttp://localhost:3333`)
})