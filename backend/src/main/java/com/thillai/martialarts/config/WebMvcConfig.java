package com.thillai.martialarts.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.base-dir}")
    private String uploadBaseDir;

    @Value("${app.upload.public-url-prefix}")
    private String publicUrlPrefix;

    /**
     * Serves uploaded photos / Aadhaar PDFs / gallery images / trainer images
     * directly from disk at e.g. GET /uploads/photos/<file>.jpg
     * Note: CORS itself is centrally handled in SecurityConfig's CorsConfigurationSource;
     * this registry only maps the static resource path.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String tmpUploads = java.nio.file.Paths.get(System.getProperty("java.io.tmpdir"), "uploads").toAbsolutePath().toString().replace("\\", "/");
        registry.addResourceHandler(publicUrlPrefix + "/**")
                .addResourceLocations(
                        "file:" + uploadBaseDir + "/",
                        "file:" + tmpUploads + "/"
                );
    }
}
