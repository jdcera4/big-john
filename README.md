# Proyecto de Gestión de Entrada/Salida

Este es un proyecto para gestionar la entrada y salida de empleados y proveedores/invitados. Utiliza un mono repositorio que incluye tanto el frontend como el backend. A continuación, se describen los pasos necesarios para iniciar el proyecto, así como las tecnologías y estructuras utilizadas.

## Contenido

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Iniciar el Proyecto](#iniciar-el-proyecto)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Frontend](#frontend-1)
- [Backend](#backend-1)
  - [Base de Datos](#base-de-datos)

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, CSS
- **Backend**: Django, Python, PostgreSQL
- **Herramientas de Construcción**: Vite (para el frontend)
- **Manejo de Paquetes**: npm (para el frontend) y pip (para el backend)
- **Control de Versiones**: Git

## base de datos
La base de datos se encuentra en la nube en la plataforma de supaBase que está en postgress

## Estructura del Proyecto

El proyecto está organizado en un mono repositorio con dos principales directorios:

1. **frontend**: Contiene el código fuente para la interfaz de usuario.
2. **backend**: Contiene el código fuente para la API y la lógica del servidor.

## Iniciar el Proyecto

### Frontend

1. **Instalación de Dependencias**:
   Navega al directorio `management_front` y ejecuta:
   ```bash
   npm install
2. **Iniciar proyecto**:
    ```bash
    npm run start

### Backend

1. **Instalación de Dependencias**:
   Navega al directorio `management_api` y ejecuta:
   ```bash
   pip install -r requirements.txt

2. **Iniciar proyecto**:
    ```bash
    python manage.py migrate
