//MONGODB

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGOURL;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log('Database is connected to:',db.connection.host))
.catch(err => console.log(err));

//NEO4J

const neo4j = require('neo4j-driver');
const driver = new neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j","1234"));

const session = driver.session({
    database: "neo4j",
});

console.log("Conetado ao Neo4J");

const neo = async () => {
    const nodes = []
    const results = await session.run("MATCH (n: Pessoa) RETURN (n)",{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome, idade: properties.idade.low })
    });
    console.log(nodes);
    session.close();
}

neo();