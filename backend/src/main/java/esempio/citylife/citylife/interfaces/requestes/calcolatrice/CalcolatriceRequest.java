package esempio.gioele.gioele.interfaces.requestes.calcolatrice;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalcolatriceRequest {
    @NotNull
    private Integer primoNumero;
    @NotNull
    private Integer secondoNumero;
}
