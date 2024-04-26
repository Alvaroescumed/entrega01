// importamos el paquete http
const http = require('http')
//importamos el paquete fs para realizar el fecth de los datos
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
const handleRequest = async(request, res) => {

    const pokeData = await fetchPokeData;
    const pokemons = decodeURI(request.url.substring(1))

    const characteristics= pokeData.find( pokemon => pokemon.name === pokemon)

    if(characteristics){
        const response = {
            'Tipo': pokemons.type,
            'HP': pokemons.base.HP,
            'Attack': pokemons.base.Attack,
            'Defense': pokemons.base.Defense,
            'Sp. Attack': pokemons.base.Sp. Attack,
            'Sp. Defense': pokemons.base.Sp. Defense,
            'Speed': pokemons.base.Speed
        }

        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(JSON.stringify(response, null, 4))
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('El pokemon que busca no existe, introducza un nombre o id correcto')
    }

}


const server = http.createServer(handleRequest)

server.listen(3000, () => {
    console.log('server listen to port 3000')
})