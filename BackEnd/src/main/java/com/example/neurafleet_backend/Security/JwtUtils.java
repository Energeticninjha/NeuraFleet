package com.example.neurafleet_backend.Security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtils {
private String jwtSecret = "NeuroFleetSecretKey_MustBeAtLeast64CharsLong_1234567890_Security";
    private int jwtExpirationMs = 86400000; // 24 hours

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}