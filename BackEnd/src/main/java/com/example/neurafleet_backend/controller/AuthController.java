package com.example.neurafleet_backend.controller;
import java.util.Optional;
import com.example.neurafleet_backend.model.User;
import com.example.neurafleet_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.neurafleet_backend.dto.AuthResponse;
import com.example.neurafleet_backend.Security.JwtUtils;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular to connect
public class AuthController {
@Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

@PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if user already exists
            if(userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists!");
            }
            
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user); // This was failing because repo was null
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            e.printStackTrace(); // This helps you see the error in the Java console
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
//     
@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
    // 1. Correct way to extract data from a Map
    String username = loginData.get("username"); 
    String password = loginData.get("password");

    // 2. Use the extracted 'username' string to find the user
    Optional<User> userOptional = userRepository.findByUsername(username);

    if (userOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Not registered. Register please");
    }

    User user = userOptional.get();

    // 3. Use the extracted 'password' string for matching
    if (passwordEncoder.matches(password, user.getPassword())) {
        
        String token = jwtUtils.generateToken(user.getUsername());

        // Safe role extraction
        String roleStr = (user.getRole() != null) ? user.getRole().toString() : "CUSTOMER";

        return ResponseEntity.ok(new AuthResponse(token, roleStr, user.getUsername()));
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("Invalid Password");
    }
}
}

