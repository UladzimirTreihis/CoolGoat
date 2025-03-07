// Archivo principal del JobMaster
import express from 'express';
import Bull from 'bull'
import IORedis from 'ioredis';


const app = express();
const port = 3004;

// Middleware para parsear JSON
app.use(express.json());

// Configura el cliente de Redis
const redisClient = new IORedis({
    host: 'redis', // Nombre del servicio Redis de Docker (para Docker) o localhost (para local)
    port: 6379,
  });

// Crea una nueva cola de trabajo llamada 'recomendaciones'
const recomendacionesQueue = new Bull('recomendaciones', {
    redis: {
        host: redisClient.options.host,
        port: redisClient.options.port,
      },
    });

 
// EVENTOS
// Evento que escucha cuando un job se completa
recomendacionesQueue.on('global:completed', async (job, result) => {
    console.log(`Job with ID: ${job.id} has been completed with result: `, result);

    try {
      let parsedResult;
      parsedResult = JSON.parse(result);

      const payload1 = {
        fixture_id: parseInt(parsedResult[0], 10),
        user_id: parsedResult[parsedResult.length-1]
      };
      const payload2 = {
        fixture_id: parseInt(parsedResult[1], 10),
        user_id: parsedResult[parsedResult.length-1]
      };
      const payload3 = {
        fixture_id: parseInt(parsedResult[2], 10),
        user_id: parsedResult[parsedResult.length-1]
      };

      if (parsedResult.length >= 2) {
        const response1 = await fetch(`http://app:3000/api/recommendations`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload1),
        });
      }

      if (parsedResult.length >= 3) {
        const response2 = await fetch(`http://app:3000/api/recommendations`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload2),
        });
      }

      if (parsedResult.length >= 4) {
        const response3 = await fetch(`http://app:3000/api/recommendations`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload3),
        });
      }
      } catch (error) {
        console.error('Error al hacer la solicitud POST:', error);
    }
});
  
// Manejar errores
recomendacionesQueue.on('failed', (job, err) => {
console.log(`Job with ID: ${job.id} failed: `, err);
});


// RUTAS
// Ruta para agregar un trabajo a la cola
app.post('/job', async (req, res) => {
    const { fixtures, bonds, user_id } = req.body;
    const job = await recomendacionesQueue.add({ fixtures: fixtures, bonds: bonds, user_id: user_id });
    res.json({ id: job.id });
});

// Ruta para verificar el estado del trabajo
app.get('/job/:id', async (req, res) => {
  const job = await recomendacionesQueue.getJob(req.params.id);
  if (job === null) {
    return res.status(404).json({ error: 'Job no encontrado' });
  }
  res.json({ estado: job.finishedOn ? 'completado' : 'pendiente', detalles: job });
});

app.get('/heartbeat', (req, res) => {
    res.json({ alive: true });
  });

app.get('/', async (req, res) => {
    const job = await recomendacionesQueue.getJob(req.params.id);
    if (job === null) {
      return res.status(404).json({ error: 'Job no encontrado' });
    }
    res.json({ message: "Hello World" });
  });

app.listen(port, () => {
  console.log(`Servicio de recomendaciones corriendo en http://localhost:${port}`);
});
