package com.thillai.martialarts.service;

import com.thillai.martialarts.dto.request.SocialLinksRequest;
import com.thillai.martialarts.entity.SiteSettings;
import com.thillai.martialarts.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final FileStorageService fileStorageService;

    public SiteSettings get() {
        return siteSettingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> siteSettingsRepository.save(SiteSettings.builder().build()));
    }

    public SiteSettings updateSocialLinks(SocialLinksRequest request) {
        SiteSettings settings = get();
        if (request.getInstagram() != null) settings.setInstagramUrl(request.getInstagram());
        if (request.getFacebook() != null) settings.setFacebookUrl(request.getFacebook());
        if (request.getYoutube() != null) settings.setYoutubeUrl(request.getYoutube());
        return siteSettingsRepository.save(settings);
    }

    public SiteSettings uploadLogo(MultipartFile logo) {
        SiteSettings settings = get();
        settings.setLogoUrl(fileStorageService.store(logo, "branding"));
        return siteSettingsRepository.save(settings);
    }
}
