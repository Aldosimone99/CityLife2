# Backend

Questo progetto fornisce funzionalità per la registrazione e l'autenticazione degli utenti, la creazione di post e commenti, la modifica dei dati personali. L'API del backend supporta varie operazioni tramite controller specifici.


## Tecnologie Utilizzate

- **Java**: Linguaggio di programmazione principale.
- **Spring Framework**: Utilizzato per la gestione delle dipendenze, la configurazione e lo sviluppo delle API REST.
- **Spring Boot**: Per semplificare la configurazione e l'avvio del progetto.
- **Hibernate**: Per la gestione della persistenza dei dati.
- **PostgreSQL**: Database utilizzato per il salvataggio dei dati.
- **Spring Security**: Per la gestione della sicurezza e dell'autenticazione.


# Controllers

   - **CommentController**: Gestisce le operazioni relative ai commenti, tra cui:
     - Creazione di nuovi commenti associati a un post specifico.
     - Recupero di tutti i commenti di un post o di un singolo commento tramite ID.
     - Modifica di un commento esistente.
     - Eliminazione di un commento specifico.
   - **PostController**: Gestisce le operazioni relative ai post, tra cui:
     - Creazione di nuovi post associati all'utente autenticato.
     - Recupero di tutti i post o di un singolo post tramite ID.
     - Eliminazione di un post specifico.
     - Gestione degli errori per input non validi o ID non corretti.
   - **UserController**: Gestisce le operazioni relative agli utenti, tra cui:
     - Registrazione di nuovi utenti con verifica della disponibilità di email o username.
     - Login e generazione di token JWT.
     - Recupero dei dettagli dell'utente autenticato.
     - Modifica dei dati personali dell'utente autenticato.
     - Recupero dei post associati a un utente specifico.
     - Eliminazione di un utente specifico.



## CommentController 

   - **Endpoint**: `/api/posts/{postId}/comments`  
       **Metodo**: POST  
       **Descrizione**: Crea un nuovo commento associato a un post specifico.  
       **Corpo della Richiesta**: `Comment` (dettagli del commento).  
       **Risposte**:  
       - 200 OK: Restituisce il commento creato.  
       - 400 Bad Request: Restituisce i dettagli dell'errore in caso di input non valido.  
       - 500 Internal Server Error: Restituisce un messaggio di errore del server.  

     - **Endpoint**: `/api/posts/{postId}/comments`  
       **Metodo**: GET  
       **Descrizione**: Recupera tutti i commenti associati a un post specifico.  
       **Risposte**:  
       - 200 OK: Restituisce una lista di commenti.  

     - **Endpoint**: `/api/posts/{postId}/comments/{commentId}`  
       **Metodo**: DELETE  
       **Descrizione**: Elimina un commento specifico.  
       **Risposte**:  
       - 204 No Content: Conferma l'eliminazione.  
       - 404 Not Found: Commento non trovato.  


 ## PostController 
   - **Endpoint**: `/api/posts`  
       **Metodo**: POST  
       **Descrizione**: Crea un nuovo post associato all'utente autenticato.  
       **Corpo della Richiesta**: `Post` (dettagli del post).  
       **Risposte**:  
       - 201 Created: Restituisce il post creato.  
       - 400 Bad Request: Restituisce i dettagli dell'errore in caso di input non valido.  

     - **Endpoint**: `/api/posts/{id}`  
       **Metodo**: GET  
       **Descrizione**: Recupera un post specifico tramite ID.  
       **Risposte**:  
       - 200 OK: Restituisce il post richiesto.  
       - 404 Not Found: Post non trovato.  

     - **Endpoint**: `/api/posts/{id}`  
       **Metodo**: DELETE  
       **Descrizione**: Elimina un post specifico.  
       **Risposte**:  
       - 204 No Content: Conferma l'eliminazione.  
       - 400 Bad Request: ID non valido.  


 ## UserController
   - **Endpoint**: `/api/users/login`  
       **Metodo**: POST  
       **Descrizione**: Effettua il login di un utente e genera un token JWT.  
       **Corpo della Richiesta**: `LoginRequest` (email e password).  
       **Risposte**:  
       - 200 OK: Restituisce il token JWT e l'ID dell'utente.  
       - 500 Internal Server Error: Restituisce un messaggio di errore del server.  

     - **Endpoint**: `/api/users/me`  
       **Metodo**: GET  
       **Descrizione**: Recupera i dettagli dell'utente autenticato.  
       **Intestazione Richiesta**: `Authorization` (token JWT).  
       **Risposte**:  
       - 200 OK: Restituisce i dettagli dell'utente.  
       - 404 Not Found: Utente non trovato.  

     - **Endpoint**: `/api/users/me`  
       **Metodo**: PUT  
       **Descrizione**: Aggiorna i dettagli dell'utente autenticato.  
       **Corpo della Richiesta**: `User` (dettagli aggiornati).  
       **Risposte**:  
       - 200 OK: Conferma l'aggiornamento.  
       - 404 Not Found: Utente non trovato.  

     - **Endpoint**: `/api/users/{id}/posts`  
       **Metodo**: GET  
       **Descrizione**: Recupera i post associati a un utente specifico.  
       **Risposte**:  
       - 200 OK: Restituisce una lista di post.  
       - 404 Not Found: Utente non trovato.


# Sicurezza

La sicurezza del progetto è gestita tramite **Spring Security** e **JWT (JSON Web Token)**. Di seguito sono riportati i principali aspetti della sicurezza implementata:

- **Autenticazione**:
  - Gli utenti si autenticano fornendo email e password tramite l'endpoint `/api/users/login`.
  - Dopo una corretta autenticazione, viene generato un token JWT che viene restituito al client.
  - Il token JWT deve essere incluso nell'intestazione `Authorization` delle richieste successive con il prefisso `Bearer`.

- **Autorizzazione**:
  - Gli endpoint protetti richiedono un token JWT valido per accedere alle risorse.
  - Il filtro `JwtRequestFilter` intercetta le richieste, valida il token JWT e imposta il contesto di sicurezza per l'utente autenticato.

- **Protezione delle risorse**:
  - Solo gli utenti autenticati possono accedere o modificare le proprie risorse (ad esempio, i dettagli del profilo o i post).
  - Le operazioni sensibili, come la modifica o l'eliminazione di dati, sono protette da controlli di autorizzazione basati sull'identità dell'utente.

- **Gestione degli errori**:
  - Le richieste con token JWT non valido o mancante restituiscono un errore HTTP 403 (Forbidden).
  - Gli errori di autenticazione e autorizzazione sono gestiti in modo centralizzato per garantire una risposta coerente.

Questa configurazione garantisce che solo gli utenti autorizzati possano accedere alle risorse e che i dati sensibili siano protetti.

## Come Avviare il Progetto

1. Assicurati di avere installato:
   - **Java 17** o versione superiore.
   - **Maven** per la gestione delle dipendenze.

2. Clona il repository:
   ```bash
   git clone https://github.com/aldosimone99/CityLife2.git
   cd CityLife2/backend
   ```

3. Avvia l'applicazione:
   ```bash
   mvn spring-boot:run
   ```

