import Bull from 'bull'


const calcularValoresPorFixture = (fixtures, bonds) => {
  // Diccionario para almacenar el resultado { fixture_id: { quantityTotal: number, apuestaTotal: number } }
  const valoresPorFixture = {};

  // Iterar sobre cada fixture
  fixtures.forEach(fixture => {
    const fixtureId = fixture.fixture_id;
    const homeTeamId = fixture.home_team_id;
    const awayTeamId = fixture.away_team_id;

    // Inicializar valores acumulados para la fixture actual
    valoresPorFixture[fixtureId] = {
      quantityTotal: 0,  // Suma de quantities de bonds
      oddTotal: 0    // Suma de valores de apuesta (odds)
    };

    let oddValue = 0;
    // Revisar cada bond para ver si se relaciona con los equipos del fixture actual
    bonds.forEach(bond => {
      
      // if (bond.status === 'won') {
        if (bond.home_team_id === homeTeamId || bond.home_team_id === awayTeamId) {
            oddValue = parseFloat(bond.odds_values[0].odd); // odd value for home team
            let roundNumber = parseInt(bond.round.match(/\d+$/)[0], 10);
            valoresPorFixture[fixtureId].quantityTotal += bond.quantity * roundNumber;
            valoresPorFixture[fixtureId].oddTotal += oddValue;
        } else if (bond.away_team_id === homeTeamId || bond.away_team_id === awayTeamId) {
            oddValue = parseFloat(bond.odds_values[2].odd); // odd value for away team
            let roundNumber = parseInt(bond.round.match(/\d+$/)[0], 10);
            valoresPorFixture[fixtureId].quantityTotal += bond.quantity * roundNumber;
            valoresPorFixture[fixtureId].oddTotal += oddValue;
        }
      // }
    });
  });

  console.log(valoresPorFixture);
  return valoresPorFixture;
};



const calcularPonderaciones = (fixtures, bonds) => {

  const aciertosPorEquipo = calcularValoresPorFixture(fixtures, bonds);

  const fixturesPond = [];
  for (const fixtureId in aciertosPorEquipo) {
    const { quantityTotal, oddTotal } = aciertosPorEquipo[fixtureId];
    if (oddTotal > 0) {  // Evitar división por cero
      const pond = quantityTotal / oddTotal;
      fixturesPond.push({ fixture_id: fixtureId, pond });
    }
  }

  // Ordenar la lista por ponderación descendente y seleccionar las 3 más altas
  fixturesPond.sort((a, b) => b.pond - a.pond);
  const top3Fixtures = fixturesPond.slice(0, 3).map(fixture => fixture.fixture_id);

  return top3Fixtures;
};



const recomendacionesQueue = new Bull('recomendaciones', {
  redis: {
    host: 'redis',  // Nombre del servicio Redis en Docker o local
    port: 6379,
  },
});

// Procesamiento de los trabajos
recomendacionesQueue.process(async (job) => {
  try
  {
    const ponds = calcularPonderaciones(job.data.fixtures, job.data.bonds);
    ponds.push(job.data.user_id);
  
    console.log(`Trabajo ${job.id} completado. Respuesta generada:`, ponds);
    return ponds;
  }
  catch (error) {
        console.error(`Error en el trabajo ${job.id}:`, error);
        throw error;
  }
});


console.log('Worker está escuchando trabajos en la cola "recomendaciones"');
