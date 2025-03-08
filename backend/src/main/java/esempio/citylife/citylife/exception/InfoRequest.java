package esempio.citylife.citylife.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoRequest {
    private ErrorDetail errors;
    private ErrorDetail warnings;
    private String method;
    private int status;
}
