import express from 'express';
import{ appendFileSync } from 'fs';
let app = express();

app.use(express.static('./'))
app.use(express.json())

app.post('/stats', (req, res) =>{
    appendFileSync('statistics.txt' , JSON.stringify(req.body) + '\n')
} )


app.listen(3000, function(){
    console.log("Екземпляр запущено через порт 3000");
});
