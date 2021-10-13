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

const database = "neo4j";

console.log("Conetado ao Neo4J");

const newUser = async (name) => {
    const session = driver.session({database: database});
    const results = await session.run("CREATE (n: Pessoa{nome:'"+name+"'})",{});
    console.log(results);
    session.close();
};

const newFriend = async (name,name2) =>{
    const session = driver.session({database: database});
    const results = await session.run("CREATE (: Pessoa{nome:'"+name+"'}) - [AMIGO_DE] -> (u2:Pessoa{nome:'"+name2+"') - [AMIGO_DE] -> (u2)",{});
    console.log(results);
    session.close();
}

const allFriends = async (name) =>{
    const nodes = []
    const session = driver.session({database: database});
    const results = await session.run("MATCH (:Pessoa{nome:'"+name+"'})-[AMIGO_DE]->(n:Pessoa) RETURN n",{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome })
    });
    session.close();
    return (nodes);
}

const users = async () => {
    const nodes = []
    const session = driver.session({database: database});
    const results = await session.run("MATCH (n: Pessoa) RETURN n",{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome })
    });
    session.close();
    return (nodes);
}

exports.newUser = newUser;
exports.newFriend = newFriend;
exports.allFriends = allFriends;
exports.users = users;