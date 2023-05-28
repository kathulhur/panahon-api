import express from 'express'
import weatherRouter from './routes/weather'
import path from 'path'

const port = 3000;

const app = express()
app.use('/api/weather', weatherRouter)

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'index.html'))

})

app.listen(port, () => {
    console.log(`Hello world app listening on port ${port}`)
})