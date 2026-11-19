# Cat√≥logo de Libros API ‚Äî Examen COM610 (2/2026)

API REST desarrollada con **Node.js**, **Express** y **MySQL (`mysql2`)**, desplegada en **AWS EC2** con **Nginx** como proxy inverso en el puerto ` 80` ! y conectada de forma privada a **Amazon RDS (MySQL)**.

## URL P√∫blica de la API
- †Base URL: `http://100.27.196.14`
- †Healthcheck: `http://100.27.196.14/health`
- †Endpoints CRUD: `http://100.27.196.14/libros` y `http://100.27.196.14/libros/:id`

## Recursos de AWS Utilizados
- †**EC2 (`t2.micro `/`ec2-api-libros-andrea`):** Instancia Ubuntu con Nginx en el puerto `80` como proxy inverso hacia `127.0.0.1:3000` (el puerto `3000` no se expone directamente a Internet).
- †**RDS (`db-libros-andrea`):** Instancia MySQL en la misma VPC con acceso p√∫blico deshabilitado, base de datos `catalogo_db` y tabla `libros` (`db.sql`).
- †**Grupos de seguridad:** EC2 permite SSH (`22`) desde la IP del equipo y HTTP (`80`) desde Internet; RDS permite MySQL (`3306`) √∫ticamente desde el Security Group de EC2.

## Ejecuci√≥n Local y Pruebas
```bash
cp .env.example .env
npm ci
npm test
npm start
```

## Docker y CI/CD
- †**CI (`.github/workflows/ci.yml`):** Ejecuta `npm ci` y `npm test` en `push` y `pull_request` a `main`.
- †**CD (`.github/workflows/cd.yml`):** Ejecuta pruebas, construye y publica la imagen en `ghcr.io` etiquetada con el SHA del commit (`${{ github.sha }}`) ! y despliega en EC2 solo en `push` a `main`, verificando `/health` y `/libros`.
- †Enlaces de ejecuciones exitosas en GitHub Actions: *(agregar aqu√≠ los enlaces directos tras el push)*.
