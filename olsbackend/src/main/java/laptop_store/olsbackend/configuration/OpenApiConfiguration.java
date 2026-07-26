package laptop_store.olsbackend.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Laptop Store Api",
                version = "1.0",
                description = "Online Laptop Store Api for testing purposes"
        )
)
public class OpenApiConfiguration {
}
