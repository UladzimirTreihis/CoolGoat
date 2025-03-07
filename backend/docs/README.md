# Pipeline de CI para el Frontend

Este proyecto incluye un pipeline de integración continua (CI) utilizando GitHub Actions para el backend. A continuación se describen los pasos necesarios para replicar este pipeline.

## Configuración del Pipeline

1. **Crear un nuevo archivo de workflow**
   - Navega a la carpeta `.github/workflows` en el repositorio.
   - Crea un nuevo archivo YAML, por ejemplo, `back-CI.yml` que es el incluido en este repositorio.

   Con esto se logra implementar el uso de Github Actions. Ahora se mostrará como ejemplo el código utilizado para este repositorio.

2. **Configurar el trigger del workflow**

   Define los eventos que activarán el pipeline. El siguiente script se ejecuta cuando hay un `push` o `pull_request` en la rama `entrega1`:

   ```yaml
   name: Backend CI Pipeline

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
         uses: actions/checkout@v3

         - name: Set up Node.js
         uses: actions/setup-node@v3
         with:
            node-version: '18'  # Actualiza a una versión compatible

         - name: Install dependencies
         run: npm install

         - name: Install ESLint dependencies
         run: npm install eslint @eslint/eslintrc @eslint/js

         - name: Run ESLint
         run: npx eslint .

         - name: Run tests
         run: node -e "assert(false)"  # BONUS - Fails the build
   ```
Los pasos especificados a nivel general son los siguientes:
- Instala las dependencias
- Corre un linter (ESLint)
- Corre un test básico, el cual solo falla para el backend, como fue indicado en el bonus con un "assert(false)"
      
