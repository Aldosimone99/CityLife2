# CityLife2

CityLife è un progetto basato su Angular per il frontend e Spring Boot per il backend. Il principio è quello di un social network, dove puoi registrarti, postare e commentare interagendo con altri utenti.

## Struttura del Progetto

### FrontEnd

La sezione FrontEnd contiene il codice dell'interfaccia utente, costruito con Angular. Per dettagli su come configurare e avviare il frontend, consulta il file [frontend/README.md](./frontend/README.md).

### BackEnd

La sezione BackEnd include il codice per il server e la gestione dell'API, costruito con Java Spring Boot. Per dettagli su come configurare e avviare il backend, consulta il file [backend/README.md](./backend/README.md).

## Panoramica del Progetto

### Funzionalità

- **Registrazione e Login**: Permettono agli utenti di creare un account e accedere all'applicazione.
- **Creazione Post**: Permette all'utente di creare o eliminare i post.
- **Creazione Commenti**: Permette all'utente di creare o eliminare i commenti nei vari post.
- **Gestione Profilo**: Permette all'utente loggato di visualizzare e aggiornare il proprio profilo.
- **Visualizzare Profili**: Permette all'utente loggato di visualizzare i profili degli altri utenti.
- **MultiLingua**: Permette all'utente di scegliere tramite toggle la lingua da utilizzare tra Italiano e Inglese.
- **Sicurezza**: Implementata con Spring Security per la gestione dell'autenticazione e autorizzazione.

### Tecnologie Utilizzate

- **Frontend**: Sviluppato con Angular, offre un'interfaccia utente dinamica e interattiva anche su mobile.
- **Backend**: Basato su Spring Boot, garantisce scalabilità e affidabilità.
- **Spring Security**: Utilizzato per implementare la sicurezza dell'applicazione.
- **API RESTful**: La comunicazione tra frontend e backend avviene tramite API RESTful.
- **Integrazione con Database**: Supporta l'integrazione con database relazionali per la persistenza dei dati.
- **Database**: PostgreSQL è utilizzato come database principale.

## Prerequisiti

Prima di eseguire l'applicazione, assicurati di avere installato:

- **Node.js** (per Angular)
- **Angular CLI**
- **Java 17+** (per Spring Boot)
- **Docker Compose** (per avviare il database PostgreSQL)
- **Maven** (per costruire il backend)


## Guida Introduttiva

Clona il progetto eseguendo il comando: git clone <https://github.com/Aldosimone99/CityLife2.git>


1. Installa le dipendenze utilizzando il comando:
   ```bash
   npm install
   ```

### Backend (Spring Boot)

1. Vai nella directory principale del progetto e avvia il docker compose:
   ```bash
   docker-compose up
   ```

2. Vai nella directory del backend:
   ```bash
   cd backend
   ```
3. Compila il progetto utilizzando Maven:
   ```bash
   mvn clean install
   ```
4. Esegui l'applicazione Spring Boot:
   ```bash
   mvn spring-boot:run
   ```

### Frontend (Angular)

1. Vai nella directory del frontend:
   ```bash
   cd frontend
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo di Angular:
   ```bash
   ng serve
   ```
4. Apri il browser e vai su `http://localhost:4200`.

## Struttura delle Cartelle

- **/backend**: Contiene l'applicazione Spring Boot.
- **/frontend**: Contiene l'applicazione Angular.

