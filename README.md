# tarea01-SistemasDistribuidos

El objetivo de esta tarea consiste en poner en práctica los conceptos de Caché y RPC vistos en clases. Para ello el alumno
deberá hacer uso de tecnologías que le permitan dar solución a la problemática planteada.

JR-GGB Spa es una empresa tradicional dedicada al rubro del e-commerce, que, debido a los diversos cambios tecnológicos, no se encuentra a la vanguardia de los nuevos requerimientos del sistema. Esta empresa realiza sus operaciones a través de SOAP, desarrollado en lenguaje C y Assembly.
Debido a un creciente aumento en usuarios en su plataforma, se traduce en un aumento en las ventas pero también
en un aumento en la carga de los servidores. La arquitectura de su sistema se basa en el mítico cliente-servidor (C-S) de
toda la vida, con un monolito recibiendo las requests (consultas) de los usuarios a toda hora. El explosivo crecimiento
de la plataforma ha hecho ver a los ingenieros de JR-GGB Spa múltiples problemas de rendimiento y escalabilidad en el
sistema. Ante esta situación la empresa ha decidido contactarlo para resolver algunos de estos problemas. Las actividades
que usted tendrá que realizar para dar solución a este problema consisten en implementar un sistema de inventarios que
consta de los siguientes m ́odulos: buscador, cache e inventario.

El siguiente repositorio consiste en un 

El sistema consta de tres partes:
- El buscador debe ser una API REST con el método search (siguiendo la misma estructura mostrada en el apartado de ejemplos). 

- El método search ha de consultar a caché si se contiene el resultado de la búsqueda en alguna key, respondiendo inmediatamente a la petición generada. 

- En caso contrario, deberá generar una petición a través de RPC para buscar en el inventario.

## Instalación
El repositorio debe de ser clonado en alguna carpeta mediante el comando 
```
$ git clone https://github.com/SConcha99/tarea01-SistemasDistribuidos.git
```
## Uso 
El primer paso consite en dirigirse a la carpeta llamada _intento_, esto es relevante pues el sistema que crea el otro docker-compose no logra establecer conexiones de manera correcta.
```
$ cd intento
```
Luego, se deben de crear las imagenes e iniciar los contenedores, esto se debe de hacer mediante el uso del comando:
```
$ docker-compose up -d
```
Una vez creados los contenedores, la aplicación se debe de encontrar dezplegada en _localhost:3000/_.

### inventory/search?q=ELEMENTO
Se encarga de buscar _ELEMENTO_ dentro de cache redis, caso de no encontrarlo este gatilla una llamada grpc, trayendo el dato y guardandolo en el caché. Este método se puede utilizar mediante el comando:
```
curl −−location −−request GET http://localhost:3000/inventory/search?q=ELEMENTO
```
Alternativamente se puede ingresar a _localhost:3000/inventory/search?q=ELEMENTO_, donde se recibirán los elementos por el browser.

Reemplazando _ELEMENTO_ con el dato que se desea buscar.

### reset
Borra todos los elementos que se encuentren en caché. Este metodo se puede utilizar mediante el comando: 
```
curl −−location −−request GET http://localhost:3000/reset
```
Alternativamente se puede ingresar a _localhost:3000/reset_, donde se recibirán los elementos por el browser.

### keys
Obtiene todas las keys y sus respectivos valores asociados que se encuentren en el caché. Este método se puede utilzar mediante el comando:
```
curl −−location −−request GET http://localhost:3000/keys
```
Alternativamente se puede ingresar a _localhost:3000/keys_, donde se recibirán los elementos por el browser.


## Configuración Redis

Si se desean modificar los parámetros de la base de datos redis, se debe de hacer lo siguiente:

Apagar los contenedores con el comando:
```
docker-compose down
```

Modificar en el archivo _Docker-compose.yml_, en el apartado del servicio _redis-server_ los siguientes parámetros:
```
 command: ["redis-server", "--bind", "redis-server","--maxmemory NEW_MAX_MEMORY","--maxmemory-policy NEW_MAX_MEMORY_POLICY"]
```
Con los parámetros  NEW_MAX_MEMORY y NEW_MAX_MEMORY_POLICY siendo las nuevas memoria máxima y politicas de remoción. 

Una vez modificados, se debe de crear un nuevo contenedor, con el comando:
```
docker-compose up -d
```

## Tabla comparativa

|               | LRU           | LFU   |
| ------------- |:-------------| :-----|
| Idea central  | Si los datos recientemente se ha visitado, entonces la probabilidad de acceso en el futuro también es mayor | Si los datos se accede muchas veces en el pasado, el futuro se accede a la frecuencia también es mayor |
|Principio |El principio del algoritmo para acceder a los datos de los datos de registro histórico. |El principio del algoritmo para el acceso a los datos de eliminación de frecuencia en base a los datos históricos.|
| Descripcion   | Algoritmo de almacenamiento en caché en el que el elemento menos utilizado en la memoria caché se elimina cada vez que se alcanza el límite de capacidad de la memoria caché. | Algoritmo de almacenamiento en caché en el que el elemento menos frecuentenebte utilizado en la memoria caché se elimina cada vez que se alcanza el límite de capacidad de la memoria caché. |
