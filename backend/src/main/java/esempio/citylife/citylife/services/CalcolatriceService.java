package esempio.gioele.gioele.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import esempio.gioele.gioele.exception.ErrorDetail;
import esempio.gioele.gioele.exception.ExceptionBackend;
import esempio.gioele.gioele.exception.InfoRequest;
import esempio.gioele.gioele.interfaces.responses.calcolatrice.CalcolatriceResponse;

@Service
public class CalcolatriceService {
    
    public CalcolatriceResponse moltiplicazione(int primoNumero, int secondoNumero) throws ExceptionBackend {
        CalcolatriceResponse response = new CalcolatriceResponse();

        if(primoNumero==0||secondoNumero==0){
            InfoRequest infoRequest = new InfoRequest(
                new ErrorDetail("Errore moltiplicazione", "Non è possibile moltiplicare per 0", null),
                null,
                "POST",
                HttpStatus.BAD_REQUEST.value()
            );
            throw new ExceptionBackend(infoRequest, null);
        }

        response.setRisultato(primoNumero * secondoNumero);
        return response;
    }

    public CalcolatriceResponse somma(int primoNumero, int secondoNumero) throws ExceptionBackend {
        CalcolatriceResponse response = new CalcolatriceResponse();
        if(primoNumero==0||secondoNumero==0){
            InfoRequest infoRequest = new InfoRequest(
                new ErrorDetail("Errore somma", "Non è possibile sommare 0", null),
                null,
                "POST",
                HttpStatus.BAD_REQUEST.value()
            );
            throw new ExceptionBackend(infoRequest, null);
        }
        return response;

    }
}
