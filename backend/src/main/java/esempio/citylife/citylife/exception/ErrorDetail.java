package esempio.citylife.citylife.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDetail {
    private String title;
    private String message;
    private Object obj;
} 
    
