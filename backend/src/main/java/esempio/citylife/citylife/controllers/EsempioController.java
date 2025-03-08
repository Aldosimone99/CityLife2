package esempio.citylife.citylife.controllers;

import org.springframework.web.bind.annotation.RestController;

import esempio.citylife.citylife.exception.CustomResponse;
import esempio.citylife.citylife.exception.ErrorDetail;
import esempio.citylife.citylife.exception.ExceptionBackend;
import esempio.citylife.citylife.exception.InfoRequest;
import esempio.citylife.citylife.interfaces.requestes.GetTokenRequest;
import esempio.citylife.citylife.interfaces.requestes.calcolatrice.CalcolatriceRequest;
import esempio.citylife.citylife.interfaces.responses.calcolatrice.GetTokenResponse;
import esempio.citylife.citylife.jwt.JwtUtil;
import esempio.citylife.citylife.services.CalcolatriceService;
import esempio.citylife.citylife.services.ExceptionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
@RequestMapping("calcolatrice/")
public class EsempioController {
    
    @Autowired
    CalcolatriceService calcolatriceService;

    @Autowired
    ExceptionService exceptionService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("moltiplicazione")
    public ResponseEntity<?> moltiplicazione(HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody CalcolatriceRequest param) {
        try{
            CustomResponse customResponse = new CustomResponse();
            customResponse.setInfoRequest(new InfoRequest(
                null,
                null,
                request.getMethod(),
                HttpStatus.OK.value()
            ));
            String token = jwtUtil.decode(request.getHeader("Authorization").substring(7));
            if(!token.equals("gioele")){
                customResponse.setInfoRequest(new InfoRequest(
                    new ErrorDetail("Errore autenticazione", "Utente non valido", null),
                    null,
                    request.getMethod(),
                    HttpStatus.UNAUTHORIZED.value()
                ));
                return ResponseEntity.badRequest().body(customResponse);
            }
            customResponse.setData(calcolatriceService.moltiplicazione(param.getPrimoNumero(), param.getSecondoNumero()));
            return ResponseEntity.ok(customResponse);
        }
        catch (ExceptionBackend e) {
            return exceptionService.handleBackendException(e, request, "POST");
        }
        catch (Exception e) {
            return exceptionService.handleGeneralException(e, request, "POST");
        }
    }

    @PostMapping("somma")
    public ResponseEntity<?> somma(HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody CalcolatriceRequest param) {
        try{
            CustomResponse customResponse = new CustomResponse();
            customResponse.setInfoRequest(new InfoRequest(
                null,
                null,
                request.getMethod(),
                HttpStatus.OK.value()
            ));
            customResponse.setData(calcolatriceService.somma(param.getPrimoNumero(), param.getSecondoNumero()));
            return ResponseEntity.ok(customResponse);
        }
        catch (ExceptionBackend e) {
            return exceptionService.handleBackendException(e, request, "POST");
        }
        catch (Exception e) {
            return exceptionService.handleGeneralException(e, request, "POST");
        }
    }

    @PostMapping("get-token")
    public ResponseEntity<?> getToken(HttpServletRequest request, HttpServletResponse response,@Valid @RequestBody GetTokenRequest param) {
        try{
            GetTokenResponse token = new GetTokenResponse(jwtUtil.generateToken(param.getUtente(), 60000L));
            CustomResponse customResponse = new CustomResponse();
            customResponse.setInfoRequest(new InfoRequest(
                null,
                null,
                request.getMethod(),
                HttpStatus.OK.value()
            ));
            customResponse.setData(token);
            return ResponseEntity.ok(customResponse);
        }
        catch (ExceptionBackend e) {
            return exceptionService.handleBackendException(e, request, "POST");
        }
        catch (Exception e) {
            return exceptionService.handleGeneralException(e, request, "POST");
        }
    }
    
    
}
