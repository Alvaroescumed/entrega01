// importamos el modulo http
const http = require('http')
//importamos el modulo fs para realizar el fecth de los datos
const fs = require('fs')

//creamos una funcion asincrona en la que fetcheamos los datos del JSON de Pokemons
const fetchPokeData = async () => {
    return new Promise ((resolve, reject) => {
        fs.readFile('./Pokedex.json', 'utf-8', (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(JSON.parse(data))
            }
        } )
    })
}

//Creaamos otra función asincrona que manje las peticiones
const handleRequest = async(req, res) => {

    const pokeData = await fetchPokeData();
    const pokeName = decodeURI(req.url.substring(1))

    const pokemons = pokeData.find( pokemon => {
        
        // creamos un bucle for en el que comprobaremos todos los idiomas del pokemon
        for ( language in pokemon.name){
            if(pokemon.name[language] === pokeName){
                return true
            } 
        }
        // una vez comprobado el idioma comprobamos si el ID del pokemon
        if(pokemon.id.toString() === pokeName){
            return true
        }

        return false

    })

    if(pokemons){
        const response = {
            'Tipo': pokemons.type,
            'HP': pokemons.base.HP,
            'Attack': pokemons.base.Attack,
            'Defense': pokemons.base.Defense,
            'Sp. Attack': pokemons.base['Sp. Attack'],
            'Sp. Defense': pokemons.base['Sp. Defense'],
            'Speed': pokemons.base.Speed
        }

        const responseJSON = JSON.stringify(response)
        
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(responseJSON)

    }else{
        
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('El pokemon que busca no existe, introducza un nombre o id correcto')
    }

}


const server = http.createServer(handleRequest)

server.listen(3000, () => {
    console.log('server listen to port 3000')
})