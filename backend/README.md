# CityLife2 Backend

CityLife2 è un progetto backend sviluppato con il framework Spring. Questo progetto fornisce le API necessarie per gestire le funzionalità di un'applicazione dedicata alla gestione della vita cittadina.

## Tecnologie Utilizzate

- **Java**: Linguaggio di programmazione principale.
- **Spring Framework**: Utilizzato per la gestione delle dipendenze, la configurazione e lo sviluppo delle API REST.
- **Spring Boot**: Per semplificare la configurazione e l'avvio del progetto.
- **Hibernate**: Per la gestione della persistenza dei dati.
- **H2 Database** (o altro database configurato): Per il salvataggio dei dati.

## Funzionalità Principali

- Gestione degli utenti (registrazione, autenticazione, ecc.).
- Gestione di eventi cittadini.
- API REST per l'interazione con il frontend.

## Come Avviare il Progetto

1. Assicurati di avere installato:
   - **Java 17** o versione superiore.
   - **Maven** per la gestione delle dipendenze.

2. Clona il repository:
   ```bash
   git clone https://github.com/aldosimone/CityLife2.git
   cd CityLife2/backend
   ```

3. Configura il database:
   - Modifica il file `application.properties` o `application.yml` per configurare il database.

4. Avvia l'applicazione:
   ```bash
   mvn spring-boot:run
   ```

5. Accedi alle API:
   - L'applicazione sarà disponibile su `http://localhost:8080`.

## Contributi

Se vuoi contribuire al progetto, sentiti libero di aprire una pull request o segnalare problemi nella sezione Issues.

## Licenza

Questo progetto è distribuito sotto la licenza MIT. Consulta il file `LICENSE` per maggiori dettagli.
