# 2024-1 / IIC2173 - E0 | CoolGoat Async Ignacio Sanhueza

***Fecha de entrega:** 02/09/2024 - 3 Semanas*

## Dominio

https://goatvault.me

## Consideraciones

* El parámetro de equipo `away` se llama con `visit` para las requests
* Para crear la base de datos, se utiliza un script `db_init/script.sql` que docker corre al inicializarse
* El archivo `api.conf` utilizado para el proxy se encuentra en la raiz del repositorio


## Comando de conexion a la instancia EC2

`ssh -i "key-e0.pem" ubuntu@ec2-3-12-175-127.us-east-2.compute.amazonaws.com`

## Servicios utilizados


* Servicio web:
    * Javascript
        * Koa       
        

* Lenguajes para el servicio de conexión a broker:
    * Javascript    
    
* Base de datos:
    * Postgresql (manejo de la bdd en la api mediante sequelize y creacion de esta mediante un script)

* Proxy Inverso:
    * nginx con certificación mediante certbot


### Requisitos funcionales (10p)

* **RF1: (3p)** ***Esencial*** Debe poder ofrecer en una **API** la lista de los distintos partidos que se han encontrado en el broker a medida que se vayan recibiendo, de forma que muestren el detalle y cuando fue su última actualización. En las llamadas se pueden ir agregando nuevos partidoss, los cuales deben ser manejados y mostrados en este endpoint. Esta lista debe ser accedida a través de HTTP en la URI que ustedes estimen conveniente, por ejemplo: *`{url}/fixtures`*. ✅
* **RF2: (1p)** ***Esencial*** Debe ofrecer un endpoint para mostrar el detalle  de cada partido recibido desde el broker. Por ejemplo: *`{url}/fixtures/{:identifier}`* :white_check_mark: ✅
* **RF3: (2p)** ***Esencial*** La lista de partidos debe estar paginada por default para que muestre cada 25 partidos y poder cambiar de pagina cambiando un *queryParam*. Por ejemplo: *`{url}/fixtures?page=2&count=25`*. Queda a criterio de ustedes si permiten traer más valores mediante otro número del count en *queryParams*. ✅
* **RF4: (4p) *Esencial*** El endpoint *`{url}/fixtures`* debe permitir filtrar los partidos por el equipo home, visita y fecha del partido de la forma: *`{url}/fixtures?home=LIS&visit=GRU&date=2024-03-14`*. Acá *home* es el código del equipo home, *visit* es el código del equipo visita, y *date* es la fecha del partido. Para este filtro siempre deben de traer los partidos que todavía no se jugan, es decir, ignorar los pasados. ✅


### Requisitos no funcionales (20p)

* **RNF1: (5p)** ***Esencial*** Debe poder conectarse al broker mediante el protocolo MQTT usando un proceso que corra de **forma constante e independiente de la aplicación web** (que corra como otro programa), los eventos recibidos deben ser persistidos con su sistema para que estos puedan ser mostrados (existen diferentes opciones). Para esto debe usar las credenciales dentro del repositorio y conectarse al canal **fixtures/info**. ✅
* **RNF2: (3p)** Debe haber un proxy inverso apuntando a su aplicación web (como Nginx o Traefik). *Todo lo que es Nginx es mejor configurarlo directamente en la instancia EC2 y no necesariamente con Docker.* ✅
* **RNF3: (2p)** El servidor debe tener un nombre de dominio de primer nivel (tech, me, tk, ml, ga, com, cl, etc) ✅
* **RNF4: (2p)** ***Esencial*** El servidor debe estar corriendo en EC2. ✅
* **RNF5: (4p)** Debe haber una base de datos Postgres o Mongo externa asociada a la aplicación para guardar eventos y consultarlos. ✅
* **RNF6: (4p)** ***Esencial*** El servicio (API Web) debe estar dentro de un container Docker. ✅

#### Docker-Compose (15p)

Componer servicios es esencial para obtener entornos de prueba confiables, especialmente en las máquinas de los desarrolladores. Además esta herramienta será necesaria durante el resto del desarrollo del proyecto para orquestar sus contenedores y servicios.

* **RNF1: (5p)** Lanzar su app web desde docker compose ✅
* **RNF2: (5p)** Integrar su DB desde docker compose (Es decir la base de datos es un contenedor). ✅
* **RNF3: (5p)** Lanzar su listener MQTT desde docker compose y conectarlo al contenedor de la app web (o base de datos si lo usara) ✅

## Variable
    
Deben elegir al menos uno de los dos grupos de requisitos siguientes.
    
#### HTTPS (25%) (15p) ✅

La seguridad es esencial para sus usuarios, por ello los datos que viajan en su aplicación web deben encriptarse con los protocolos correspondientes.

* **RNF1: (7p)** El dominio debe estar asegurado por SSL con Let’s Encrypt. ✅
* **RNF2: (3p)** Debe poder redireccionar HTTP a HTTPS. ✅
* **RNF3: (5p)** Se debe ejecutar el chequeo de expiración del certificado SSL de forma automática 2 veces al día (solo se actualiza realmente si está llegando a la fecha de expiración). ✅

Algunos software de terceros requieren que sus aplicaciones funcionen con HTTPs, por lo que sin esta capa de seguridad no se puede integrar a dichos servicios. En futuras entregas será necesario tener implementado HTTPs por lo antes mencionado, por lo que si lo logran mejor!.

#### Balanceo de Carga con Nginx (25%) (15p) ❌

Para escalar el servicio de forma horizontal podemos replicar el contenedor de la aplicación web y utilizar NGINX como balanceador de carga, así podemos crear tantos servidores como nuestro servicio necesite. Esto es altamente necesario para aplicaciones que en ciertos momentos tendrán una carga importante y en otros no.

* **RF1: (5p)** Debe replicar al menos 2 contenedores de su aplicación web para que corran en paralelo.
* **RF2: (10p)** Debe configurar Nginx para que haga un balanceo de carga hacia los servidores levantados (Pueden encontrar la configuración en la documentación de NGINX).
