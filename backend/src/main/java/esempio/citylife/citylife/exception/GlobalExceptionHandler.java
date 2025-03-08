package esempio.citylife.citylife.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExceptionBackend.class)
    public ResponseEntity<CustomResponse> handleExceptionBackend(ExceptionBackend ex) {
        // Restituisci l'oggetto CustomResponse come body della risposta
        return new ResponseEntity<>(ex.getErrorResponse(), ex.getStatus());
    }

    // Aggiungi questo metodo per gestire gli errori 404
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<CustomResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        // Crea il messaggio di errore personalizzato per il 404
        ErrorDetail errorDetail = new ErrorDetail(
            "Funzionalità non trovata",
            "L'endpoint richiesto non esiste",
            null
        );
        InfoRequest infoRequest = new InfoRequest(
            errorDetail, null, ex.getHttpMethod(), HttpStatus.NOT_FOUND.value()
        );
        
        CustomResponse customResponse = new CustomResponse();
        customResponse.setInfoRequest(infoRequest);

        // Restituisci la risposta con status 404
        return new ResponseEntity<>(customResponse, HttpStatus.NOT_FOUND);
    }
}
