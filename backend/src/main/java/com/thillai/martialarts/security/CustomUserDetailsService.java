package com.thillai.martialarts.security;

import com.thillai.martialarts.entity.Student;
import com.thillai.martialarts.repository.StudentRepository;
import com.thillai.martialarts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .or(() -> studentRepository.findByStudentId(username).map(Student::getUser))
                .or(() -> studentRepository.findByMobile(username).map(Student::getUser))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
