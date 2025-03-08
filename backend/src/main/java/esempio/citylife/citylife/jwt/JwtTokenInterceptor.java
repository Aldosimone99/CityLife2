package esempio.citylife.citylife.jwt;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import esempio.gioele.gioele.exception.ErrorDetail;
import esempio.gioele.gioele.exception.ExceptionBackend;
import esempio.gioele.gioele.exception.InfoRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;



@Component
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @SuppressWarnings("null")
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            InfoRequest infoRequest = new InfoRequest(
                new ErrorDetail("Errore token", "Token non trovato", null),
                null,
                "POST",
                HttpStatus.BAD_REQUEST.value()
            );
            throw new ExceptionBackend(infoRequest, null);
        }

        String token = header.substring(7);
        if (!jwtUtil.validateToken(token)) {
            InfoRequest infoRequest = new InfoRequest(
                new ErrorDetail("Errore token", "token non valido o scaduto", null),
                null,
                "POST",
                HttpStatus.BAD_REQUEST.value()
            );
            throw new ExceptionBackend(infoRequest, null);
        }

        return true;
    }
}