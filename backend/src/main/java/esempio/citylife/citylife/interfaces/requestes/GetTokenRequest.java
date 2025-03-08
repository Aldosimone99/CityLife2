package esempio.citylife.citylife.interfaces.requestes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTokenRequest {
    private String utente;
}
