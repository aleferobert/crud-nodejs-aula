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

const driver = new neo4j.driver(process.env.NEO4JURL, neo4j.auth.basic(process.env.NEO4JUSER,process.env.NEO4JPASS));

const database = process.env.NEO4JDATABASE;

console.log("Conetado ao Neo4J");
//CRIA USUARIO
const newUser = async (name, email) => {
    const session = driver.session({database: database});
    const results = await session.run("CREATE (n: Pessoa{nome:'"+name+"',avatar:'/img/avatar/avatar.jpeg', email:'"+email+"'})",{});
    console.log(results);
    session.close();
};
//ADICIONA AMIGO
const newFriend = async (email,name2) =>{
    const session = driver.session({database: database});
    const results = await session.run("MATCH (u:Pessoa{email:'"+email+"'}),(u2:Pessoa{nome:'"+name2+"'}) WHERE NOT (u)- [:AMIGO_DE]->(u2) AND NOT u = u2 CREATE (u) - [:AMIGO_DE] -> (u2)",{});
    session.close();
}
//REMOVE AMIGO
const removeFriend = async (email,name2) =>{
    const session = driver.session({database: database});
    const results = await session.run("MATCH (u:Pessoa{email:'"+email+"'}) - [r:AMIGO_DE] ->(u2:Pessoa{nome:'"+name2+"'}) DELETE (r)",{});
    session.close();
}
//VER TODOS OS AMIGOS
const allFriends = async (email,name) =>{
    const nodes = []
    const session = driver.session({database: database});
    var resultsq;
    if(!name) {
    resultsq = "MATCH (:Pessoa{email:'"+email+"'})-[AMIGO_DE]->(n:Pessoa) RETURN n"
    } else {
    resultsq = "MATCH (:Pessoa{nome:'"+name+"'})-[AMIGO_DE]->(n:Pessoa) RETURN n"
    }
    const results = await session.run(resultsq,{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome })
    });
    session.close();
    return (nodes);
}
//VER TODOS OS USUARIOS
const users = async (email) => {
    const nodes = []
    const session = driver.session({database: database});
    const results = await session.run("MATCH (n:Pessoa{email:'"+email+"'}),(n2:Pessoa) WHERE NOT (n)-[:AMIGO_DE]->(n2) AND NOT n2.email = '"+email+"' RETURN n2",{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome , avatar: properties.avatar})
    });
    session.close();
    return (nodes);
}

const user = async (email) => {
    const nodes = []
    const session = driver.session({database: database});
    const results = await session.run("MATCH (n: Pessoa{email:'"+email+"'}) RETURN n",{});
    results.records.forEach(res => {
        const properties = res.get(0).properties;
        nodes.push({nome: properties.nome, avatar: properties.avatar })
    });
    session.close();
    return (nodes);
}

const attAvatar = async(email,id, remove) =>{
    const session = driver.session({database: database});
    if(!remove ){
        const results = await session.run("MATCH (n:Pessoa{email:'"+email+"'}) SET n.avatar ='/img/avatar/"+id+"' RETURN n.avatar",{});
       
    } else {
        const results = await session.run("MATCH (n:Pessoa{email:'"+email+"'}) SET n.avatar ='/img/avatar/avatar.jpeg' RETURN n.avatar",{});
    }
     session.close();
}

exports.newUser = newUser;
exports.newFriend = newFriend;
exports.removeFriend = removeFriend;
exports.allFriends = allFriends;
exports.users = users;
exports.user = user;
exports.attAvatar = attAvatar;