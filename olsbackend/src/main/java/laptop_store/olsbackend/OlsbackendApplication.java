package laptop_store.olsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"controller","service","entity", "repository", "dto", "mapper"})
public class OlsbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OlsbackendApplication.class, args);
	}

}
