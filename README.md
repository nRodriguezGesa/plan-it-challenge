<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Challenge NodeJS Plan IT
## Instrucciones de instalacion
### Prerequisitos
-Docker y Docker Compose
-NodeJS
-Variables de entorno (se incluye el .env en el repositorio ya que es un challenge y no hay datos sensibles)
### Instalacion
```bash
$ docker-compose up -d
```
Este comando levantara 2 contenedores
1: NodeJS API
2: MsSQL

Para comprobar que el proyecto esta corriendo correctamente, se puede consumir el endpoint "health" 

### Uso de la API
La api cuenta con 2 endpoints:

#### Health check: /health 
Se encarga de dar informacion acerca de la salud del servidor, incluye detalles de uso de memoria y procesos activos
```bash
curl http://localhost:3000/plan-it/pi/v1/health
```
#### Procesar archivo de clientes: /client/batch
Se encarga de procesar el archivo de clientes y guardarlos en la base de datos.
Posee tolerancia a errores en lineas corruptas del archivo, ignorandolas y continuando con el resto.
Recibe el path del archivo como parametro
```bash
curl -X POST http://localhost:3000/plant-it/api/v1/client/batch \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/usr/src/app/data/clients.dat"}'
```
### Decisiones tecnicas
#### Procesamiento por lotes (batch)
Los lotes son de X registros (configurable). Se realizo de esta manera para evitar saturar la DB con un gran volumen de datos.
Ademas se utilizo un strategy pattern para ofrecer flexibilidad y escalabilidad en caso de que se requieran procesar otro tipo de archivos
#### Lectura del archivo con streams
Se utilizo readline interface con streams para leer el archivo de forma eficiente y no tener que cargar todo el archivo en memoria
#### Validacion de input
-Se uso un middleware(nestjs pipeline) para validar la extension y ruta del archivo a cargar (por falta de tiempo no se agrego validacion para que los archivos pertenezcan unicamente a una ruta permitida)
-Se validaron los campos del archivo para definir si eran lineas validas o corruptas
#### Optimizaciones
- Se implemento una llamada al garbage collector para liberar memoria en el procesamiento de archivos
- Se inserto indices estrategicos para la entidad de clientes
- Se inserto en base de datos por lotes evitando duplicados
#### Mejoras para produccion
- Se podria escalar horizontalmente agregando pods replicas y que estos procesen los archivos de forma distribuida
- Se podria utilizar un servicio de mensajeria por colas como RabbitMQ
- Optimizar almacenamiento moviendo datos antiguos a cold storage
- Se podria generar archivos de log para debuggear errores en cada procesamiento de archivo
- Crear replicas de lectura para mejorar la disponibilidad
- Crear un sistema de checkpoints para reanudar el procesamiento en caso de falla
#### Funcionalidades que me hubiese gustado agregar en caso de tener mas tiempo
- Agregar autenticacion/autorizacion
- Implementacion de swagger con NestJS
- Agregar tests unitarios con mocks diversos de datos
- Agregar una entidad de base de datos para guardar cada evento de procesamiento de archivo con propiedades como: id de batch, fecha, cantidad de lineas procesadas, cantidad de lineas corruptas, etc 
- Agregar un endpoint para obtener detalles del procesamiento de un archivo
- Agregar detalles al endpoint de health para obtener detalles del procesamiento de un archivo

