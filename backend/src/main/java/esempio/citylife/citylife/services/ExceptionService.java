package esempio.gioele.gioele.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import esempio.gioele.gioele.exception.CustomResponse;
import esempio.gioele.gioele.exception.ErrorDetail;
import esempio.gioele.gioele.exception.ExceptionBackend;
import esempio.gioele.gioele.exception.InfoRequest;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class ExceptionService {
    
    // Gestione delle eccezioni backend
    public ResponseEntity<?> handleBackendException(ExceptionBackend e, HttpServletRequest request, String method) {
        e.getErrorResponse().getInfoRequest().setMethod(method);
        return ResponseEntity
                .status(e.getStatus())
                .body(e.getErrorResponse());
    }

    // Gestione delle eccezioni generali
    public ResponseEntity<?> handleGeneralException(Exception e, HttpServletRequest request, String method) {
        e.printStackTrace();
        InfoRequest infoRequest = new InfoRequest(
                new ErrorDetail("Errore Interno", "Si è verificato un problema interno", null),
                null,
                method,
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        CustomResponse errorResponse = new CustomResponse(infoRequest, null);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
    }
}
