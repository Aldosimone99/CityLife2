# Citylife
## Sito Online
[https://citylife1.netlify.app/](https://citylife1.netlify.app/)
# Panoramica

L'applicazione si concentra sullo sviluppo urbano e si integra con la piattaforma GoRest per fornire funzionalità di gestione degli utenti, post e commenti. 
Il sito è ottimizzato sia per Desktop sia per mobile.
Le principali funzionalità includono:

# Pagina di Login

L'applicazione offre la possibilità agli utenti di autenticarsi o registrarsi tramite la piattaforma GoRest. Ecco alcuni dettagli specifici riguardo a questa funzionalità:

## Form di Login

Il form di login richiede l'autenticazione attraverso la piattaforma GoRest. 
Per completare con successo il processo di login, è necessario fornire il token, che può essere ottenuto tramite l'autenticazione su [https://gorest.co.in/consumer/login](https://gorest.co.in/consumer/login).

## Supporto Multilingua

Nella pagina di login, sotto il form, è possibile scegliere la lingua (Italiana o Inglese) da utilizzare nel sito;
E' possibile modificarla anche dopo il login con il toggle nella navbar.


# Pagina Utenti

La pagina degli utenti offre una visione completa di tutti gli utenti disponibili, ed è possibile:
- Effettuare ricerche per nome o email tramite la barra di ricerca.
- Eliminare un utente.
- Visualizzare lo stato di un utente indicato da un pallino colorato:
  - Verde se lo stato è `active`.
  - Rosso se lo stato è `inactive`.
- Decidere il numero di utenti da visualizzare tramite un toggle vicino il bottone per aggiungere un nuovo utente.

## Utilizzo del Form di Creazione Utente

Il form di creazione utente si trova premendo il bottone 'add user' o 'aggiungi un utente' nella pagina Users e richiede i seguenti input:

- **Name**: Nome dell'utente
- **Email**: Email dell'utente
- **Gender**: Genere dell'utente
- **Status**: Stato dell'utente

Il form contiene due bottoni:

- **X**: Annulla l'operazione e chiude il form.
- **Aggiungi Utente/ Add User**: Controlla se un utente con la stessa email esiste già. Se non esiste, crea un nuovo utente e lo aggiunge alla lista. Se esiste, mostra un messaggio di errore e non crea l'utente.


## Eliminare un utente

Per eliminare un utente:

1. Clicca sull'icona del cestino nel box dell'utente che desideri eliminare.
2. Si aprirà un popup con il messaggio di conferma.
3. Seleziona "Annulla" o "Cancel" per annullare l'operazione e lasciare tutto invariato.
4. Seleziona "Cancella" o "Delete" per confermare l'eliminazione dell'utente. L'utente sarà rimosso dalla lista.


# Profilo Utente

Ogni utente ha un proprio profilo dove è possibile visualizzare:

## Sidebar a sinistra:
Dove si trovano i dettagli dell'utente come:
- **Nome**: Nome dell'utente.
- **Stato**: Indicato da un pallino colorato:
  - Verde se lo stato è `active`.
  - Rosso se lo stato è `inactive`.
- **Email**: Email dell'utente.

Nella colonna centrale è possibile:
- Visualizzare tutti i post dell'utente,
- Creare nuovi post.
- Visualizzare i commenti sotto al post.
- Eliminare post o singoli commenti.

## Visualizzazione Post e Commenti

- **Post dell'Utente**: Se l'utente ha pubblicato dei post, questi saranno visualizzati sotto i dettagli dell'utente.
- **Comments**: Ogni post ha un bottone "Comments" o "Commenti" che, se premuto, mostra i commenti relativi a quel post. Mostrerà anche un input box dove è possibile aggiungere un ulteriore commento.
- **Delete**: Ogni post ha un bottone delete che permette di eliminarlo. Questo bottone è disponibile anche nei commenti per eliminare il commento selezionato.

### Messaggio di Nessun Post

Se l'utente non ha pubblicato alcun post, verrà visualizzato un messaggio indicante che quell'utente non ha pubblicato nessun post:
`No Posts Available`

### Creazione di un Nuovo Post

In ogni pagina utente è disponibile un box dove poter inserire il testo del post e pubblicarlo premendo il bottone 'Post' o 'Pubblica'



# Posts
La pagina dei post consente di visualizzare, filtrare e gestire i post. Di seguito sono descritte le principali caratteristiche e funzionalità della pagina:
- **Creare Post**: È possibile creare nuovi post tramite un input e un bottone per pubblicarlo, come nelle pagine profilo degli utenti.
- **Eliminare Post**: È possibile eliminare i post dei vari utenti tramite il bottone 'delete' o 'elimina'; qui comparirà poi un popup di conferma.
- **Filtraggio dei Post**: C'è un input che consente di filtrare inserendo del testo.
- **Paginatore**: Permette di navigare tra le pagine dei post tramite dei bottoni posti in basso sotto alla colonna dei post.
- **Selezionatore di Post per Pagina**: Consente di selezionare il numero di post da visualizzare per pagina, con le stesse funzionalità della pagina degli utenti.
- **Gestione Commenti**: Ogni post ha un bottone "Commenti" o "Comments" che permette di visualizzare i commenti relativi al post. Quando premuto, oltre ai commenti, viene mostrato un input di testo che consente di inserire un nuovo commento. È possibile eliminare i vari commenti tramite l'icona del cestino.



# Logout 
Il bottone di Logout è presente nella statusbar e permette di effettuare il logout e reinderizzerà automaticamente nella pagina di login.
##
##
# Come Utilizzare

1. **Clona il repository**: `git clone <https://github.com/Aldosimone99/CityLife>`
2. **Installa le dipendenze**: `npm install`
3. **Avvia il progetto**: `ng serve`
4. **Accedi all'applicazione**: Apri `http://localhost:4200` nel tuo browser.

Per autenticarti, segui le istruzioni nella pagina di login per ottenere il token di accesso dalla piattaforma [GoRest](https://gorest.co.in/).

## API Endpoints

L'applicazione si interfaccia con l'API di GoRest per fornire funzionalità di gestione degli utenti e dei post. Di seguito sono elencati gli endpoints principali forniti dai servizi `UserService` e `PostService`:
### Autenticazione

- **Registra un nuovo utente:**
  - Metodo: `POST`
  - Endpoint: `/v2/users`
  - Descrizione: Registra un nuovo utente.

### Profilo Utente

- **Trova tutti gli utenti:**

  - Metodo: `GET`
  - Endpoint: `/v2/users`
  - Descrizione: Ottiene le informazioni di tutti gli utenti.

- **Elimina un utente:**

  - Metodo: `DELETE`
  - Endpoint: `/v2/users/:userId`
  - Descrizione: Cancella un utente dato il suo ID.

- **Modifica il profilo utente:**
  - Metodo: `PUT`
  - Endpoint: `/v2/users/:userId`
  - Descrizione: Modifica il profilo di un utente.

### Post

- **Trova tutti i post:**

  - Metodo: `GET`
  - Endpoint: `/v2/posts`
  - Descrizione: Ottiene le informazioni di tutti i post.

- **Trova i post di un utente:**

  - Metodo: `GET`
  - Endpoint: `/v2/users/:userId/posts`
  - Descrizione: Ottiene i post di un utente dato il suo ID.

- **Aggiungi un nuovo post:**

  - Metodo: `POST`
  - Endpoint: `/v2/users/:userId/posts`
  - Descrizione: Aggiunge un nuovo post per un utente specifico.

- **Commenta un post:**

  - Metodo: `POST`
  - Endpoint: `/v2/posts/:postId/comments`
  - Descrizione: Aggiunge un commento a un post.

- **Leggi i commenti di un post:**
  - Metodo: `GET`
  - Endpoint: `/v2/posts/:postId/comments`
  - Descrizione: Ottiene i commenti di un post dato il suo ID.

Questo progetto è stato generato con la versione 19. [Angular CLI](https://github.com/angular/angular-cli)






