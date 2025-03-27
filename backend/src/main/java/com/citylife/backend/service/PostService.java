package com.citylife.backend.service;

import com.citylife.backend.model.Post;
import com.citylife.backend.model.User;
import com.citylife.backend.repository.PostRepository;
import com.citylife.backend.repository.UserRepository;
import com.citylife.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository; // Ensure this repository is available

    @Autowired
    private JwtUtil jwtUtil; // Ensure JwtUtil is available for extracting user information

    @Transactional // Ensure this method runs within a transaction
    public Post savePost(Post post) {
        if (post.getBody() == null || post.getBody().trim().length() < 1) {
            throw new IllegalArgumentException("Post body must be at least 1 character long");
        }
        if (post.getBody().length() > 10000) { // Example: Limit the body to 10,000 characters
            throw new IllegalArgumentException("Post body must not exceed 10,000 characters");
        }

        // Fetch the full user object and set it in the post
        User user = userRepository.findById(post.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + post.getUser().getId()));
        post.setUser(user);

        return postRepository.save(post);
    }

    @Transactional
    public Post savePostWithLoggedInUser(Post post, String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", "")); // Extract email instead of username
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email)); // Use findByEmail
        post.setUser(user);

        if (post.getBody() == null || post.getBody().trim().length() < 1) {
            throw new IllegalArgumentException("Post body must be at least 1 character long");
        }
        if (post.getBody().length() > 10000) {
            throw new IllegalArgumentException("Post body must not exceed 10,000 characters");
        }

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
    }
}
