# Pipeline de CI para el Frontend

Este proyecto incluye un pipeline de integración continua (CI) utilizando GitHub Actions para el frontend. A continuación se describen los pasos necesarios para replicar este pipeline.

## Configuración del Pipeline

1. **Crear un nuevo archivo de workflow**
   - Navega a la carpeta `.github/workflows` en el repositorio.
   - Crea un nuevo archivo YAML, por ejemplo, `front-CI.yml` que es el incluido en este repositorio.

   Con esto se logra implementar el uso de Github Actions. Ahora se mostrará como ejemplo el código utilizado para este repositorio.

2. **Configurar el trigger del workflow**

   Define los eventos que activarán el pipeline. El siguiente script se ejecuta cuando hay un `push` o `pull_request` en la rama `entrega1`:

   ```yaml
   name: Frontend CI Pipeline

      on:
      push:
         branches:
            - entrega1
      pull_request:
         branches:
            - entrega1

      jobs:
      build:
         runs-on: ubuntu-latest

         steps:
         - name: Checkout code
            uses: actions/checkout@v2

         - name: Set up Node.js
            uses: actions/setup-node@v2
            with:
            node-version: '18'

         - name: Install dependencies
            run: npm install

         - name: Install ESLint dependencies
            run: npm install eslint

         - name: Run ESLint
            run: npm run lint

         - name: Build the project
            run: npm run build

         - name: Serve the project
            run: npx serve -s build

         - name: Install Chrome
            run: sudo apt-get install -y google-chrome-stable

         - name: Wait for the server to be ready
            run: sleep 60

         - name: Check if server is running
            run: curl -I http://localhost:3000

         - name: Run Lighthouse # BONUS Frontend
            uses: treosh/lighthouse-ci-action@v8
            with:
            urls: 'http://localhost:3000'
            uploadArtifacts: true
            env:
            CHROME_PATH: $(which google-chrome-stable)
   ```
Los pasos especificados a nivel general son los siguientes:
- Instala las dependencias
- Corre un linter (ESLint)
- Intenta hacer revisiones de performance con lighthouse.
      
