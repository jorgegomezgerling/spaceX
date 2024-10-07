import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';


document.querySelector('#app').innerHTML = `
    <h1>¡SpaceX: lanzamientos!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
      Clickear en cada icono para más detalles.
    </p>
  </div>
`;

setupCounter(document.querySelector('#counter'));

// URL
const apiUrl = 'https://api.spacexdata.com/v5/launches';

// Funcion para api
async function fetchLaunches() {
    try {
        const response = await fetch(apiUrl);
        const launches = await response.json();
        
        displayLaunches(launches);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Función para mostrar los lanzamientos en la interfaz
function displayLaunches(launches) {
  const appDiv = document.getElementById('app');

  const launchesGrid = document.createElement('div');
  launchesGrid.className = 'launches-grid';

  launches.forEach(launch => {
      const launchCard = document.createElement('div');
      launchCard.className = 'launch-card';

      // Añadimos un evento clic a la tarjeta
      launchCard.addEventListener('click', () => showLaunchDetails(launch));

      launchCard.innerHTML = `
          <h3>${launch.name}</h3>
          <img src="${launch.links.patch.small}" alt="${launch.name}" class="launch-image">
      `;

      launchesGrid.appendChild(launchCard);
  });

  appDiv.appendChild(launchesGrid);
}

function showLaunchDetails(launch) {
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // limpiar 

  // detalles del lanzamiento
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'launch-details';

  detailsDiv.innerHTML = `
        <h2>${launch.name}</h2>
        <img src="${launch.links.patch.large || launch.links.patch.small}" alt="${launch.name}">
        <p><strong>Fallas:</strong> ${launch.failures.length > 0 ? launch.failures.map(failure => failure.reason).join(', ') : 'Ninguna'}</p>
        <p><strong>Número de vuelo:</strong> ${launch.flight_number}</p>
        <p><strong>Fecha y hora de despegue:</strong> ${new Date(launch.date_utc).toLocaleString()}</p>
        <button id="back-button">Volver</button>
    `;

  // Para la vista de detalles div principal
  appDiv.appendChild(detailsDiv);

  document.getElementById('back-button').addEventListener('click', () => {
      appDiv.innerHTML = ''; // Limpiar detalles
      fetchLaunches(); // Volver a cargar los lanzamientos
  });
}


// solicitud
fetchLaunches();
