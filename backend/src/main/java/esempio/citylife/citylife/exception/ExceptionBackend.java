package esempio.citylife.citylife.exception;

import org.springframework.http.HttpStatus;


public class ExceptionBackend extends RuntimeException  {
    private final CustomResponse errorResponse;
    private final HttpStatus status;

    public ExceptionBackend(InfoRequest infoRequest, Object response)  {
        super(infoRequest.getErrors() != null ? infoRequest.getErrors().getMessage() : null);
        this.errorResponse = new CustomResponse(infoRequest, response);
        this.status = HttpStatus.valueOf(infoRequest.getStatus());
    }

    public CustomResponse getErrorResponse() {
        return errorResponse;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
