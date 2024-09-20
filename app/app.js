// require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { Sequelize, DataTypes } = require('sequelize');
const { Fixture, League, Team } = require('./models');
const { Op } = require('sequelize');


const app = new Koa();
const router = new Router();
const config = require('./config/config.js');

const dbConfig = config['development'];
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

app.use(bodyParser());

router.post('/fixtures', async (ctx) => {
    const { message } = ctx.request.body;
    const jsonMessage = JSON.parse(message);

    console.log(`Mensaje recibido del cliente MQTT: largo: ${Object.keys(jsonMessage.fixtures).length}`);

    try {
        const batchSize = 50; // Número de fixtures a procesar en cada lote
        for (let i = 0; i < jsonMessage.fixtures.length; i += batchSize) {
            
        
            const batch = jsonMessage.fixtures.slice(i, i + batchSize);
            for (const fixtureData of batch) {
                let awayTeam = fixtureData.teams.away;
                let homeTeam = fixtureData.teams.home;
                let league = fixtureData.league;
                let fixture = fixtureData.fixture;
                let goals = fixtureData.goals;
                let odds = fixtureData.odds;
                let odds_home = null;
                let odds_away = null;
                let odds_draw = null;
                if (odds[0].values[0]) {
                    odds_home = odds[0].values[0].odd;
                }
                if (odds[0].values[1]) {
                    odds_away = odds[0].values[1].odd;
                }
                if (odds[0].values[2]) {
                    odds_draw = odds[0].values[2].odd;
                } 

                
                // upsert home team
                await Team.upsert({
                    id: homeTeam.id,
                    name: homeTeam.name,
                    logo: homeTeam.logo,
                    winner: homeTeam.winner
                });
                // upsert away team
                await Team.upsert({
                    id: awayTeam.id,
                    name: awayTeam.name,
                    logo: awayTeam.logo,
                    winner: awayTeam.winner
                });
                // upsert league
                await League.upsert({
                    id: league.id,
                    name: league.name,
                    country: league.country,
                    logo: league.logo,
                    flag: league.flag,
                    season: league.season,
                    round: league.round
                });
                // upsert fixture
                await Fixture.upsert({
                    id: fixture.id,
                    referee: fixture.referee,
                    timezone: fixture.timezone,
                    date: fixture.date,
                    timestamp: fixture.timestamp,
                    status_long: fixture.status.long,
                    status_short: fixture.status.short,
                    status_elapsed: fixture.status.elapsed,
                    league_id: league.id,
                    home_team_id: homeTeam.id,
                    away_team_id: awayTeam.id,
                    home_goals: goals.home,
                    away_goals: goals.away,
                    home_odds: odds_home,
                    away_odds: odds_away,
                    draw_odds: odds_away
                }
            );

            }
        }

        ctx.body = { status: 'success', message: 'Fixtures procesados correctamente' };
        ctx.status = 200;
    } catch (error) {
        console.error('Error al actualizar base de datos:', error);
        ctx.body = { status: 'error', message: 'Error al procesar fixtures' };
        ctx.status = 500;
    }
     
    ctx.body = { status: 'success', message: 'Mensaje recibido correctamente' };
    ctx.status = 200;
});

async function checkDatabase() {
    try {
        // Probar la conexión
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');
        
    } catch (error) {
        console.error('No se pudo conectar a la base de datos o hubo un error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabase();

Fixture.belongsTo(League, { foreignKey: 'league_id', as: 'league' });
Fixture.belongsTo(Team, { foreignKey: 'home_team_id', as: 'homeTeam' });
Fixture.belongsTo(Team, { foreignKey: 'away_team_id', as: 'awayTeam' });

League.hasMany(Fixture, { foreignKey: 'league_id' });
Team.hasMany(Fixture, { foreignKey: 'home_team_id' });
Team.hasMany(Fixture, { foreignKey: 'away_team_id' });

// 
router.get('/fixtures', async (ctx) => {

    const { home, visit, date } = ctx.query;
    const page = parseInt(ctx.query.page, 10) || 1;
    const count = parseInt(ctx.query.count, 10) || 25; 

    const offset = (page - 1) * count;

    const where = {};


    if (date) {
        where.date = date;
    }

    if (home) {
        const homeTeam = await Team.findOne({
            where: { name: home }
        });

        if (homeTeam) {
            where.home_team_id = homeTeam.id;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Home team not found' };
            return;
        }
    }

    if (visit) {
        const visitTeam = await Team.findOne({
            where: { name: visit }
        });

        if (visitTeam) {
            where.away_team_id = visitTeam.id;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Visit team not found' };
            return;
        }
    }

    where.date = {
        [Op.gte]: new Date() // Filtra partidos donde la fecha es mayor o igual a la fecha actual
    };

    try {
        const fixtureList = await Fixture.findAndCountAll({
            where,
            limit: count,
            offset: offset,
            include: [
                {
                    model: League,
                    as: 'league',
                    attributes: ['id', 'name', 'country', 'logo', 'flag', 'season', 'round']
                },
                {
                    model: Team,
                    as: 'homeTeam',
                    attributes: ['id', 'name', 'logo', 'winner']
                },
                {
                    model: Team,
                    as: 'awayTeam',
                    attributes: ['id', 'name', 'logo', 'winner']
                }
            ]
        });
        
        
    ctx.body = {
        status: "success",
        data: fixtureList
    };
    } catch (error) {
        console.log(error)
        
    }
})

router.get('/', async (ctx) => {
    ctx.body = 'Bienvenido a goatvault :)';
})

router.get('/fixtures/:id', async (ctx) => {

    const { id } = ctx.params;

    try {
        const fixtureItem = await Fixture.findByPk(id, {include: [
            {
                model: League,
                as: 'league',
                attributes: ['id', 'name', 'country', 'logo', 'flag', 'season', 'round']
            },
            {
                model: Team,
                as: 'homeTeam',
                attributes: ['id', 'name', 'logo', 'winner']
            },
            {
                model: Team,
                as: 'awayTeam',
                attributes: ['id', 'name', 'logo', 'winner']
            }
        
        ]});

        if (!fixtureItem) {
            ctx.body = {
                status: 'error',
                message: `Fixture con ID ${id} no encontrado`,
            };
            ctx.status = 404;
            return;
        }

        ctx.body = {
            status: 'success',
            data: fixtureItem,
        };
        ctx.status = 200;
    } catch (error) {
        ctx.body = {
            status: 'error',
            message: error.message,
        };
        ctx.status = 500;
    }




})


app.use(router.routes()).use(router.allowedMethods());

const port = 3000;
const server = app.listen(port, () => {
    console.log(`API corriendo en puerto ${port}`);
});
