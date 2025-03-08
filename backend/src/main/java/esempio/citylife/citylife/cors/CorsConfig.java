package esempio.citylife.citylife.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;




@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*") // Permette pattern di origine
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
