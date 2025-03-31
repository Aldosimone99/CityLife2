package com.citylife.backend.service;

import com.citylife.backend.model.Comment;
import com.citylife.backend.repository.CommentRepository;
import com.citylife.backend.model.User;
import com.citylife.backend.repository.UserRepository;
import com.citylife.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public Comment createComment(Long postId, Comment comment) {
        comment.setPostId(postId);
        return commentRepository.save(comment);
    }

    public Comment createCommentWithLoggedInUser(Long postId, Comment comment, String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", "")); // Extract email from token
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email)); // Use findByEmail
        comment.setUserId(user.getId()); // Associate the comment with the logged-in user
        comment.setAuthor(user.getFirstName() + " " + user.getLastName()); // Set the author's name
        comment.setPostId(postId); // Ensure the postId is set
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment getCommentById(Long postId, Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        return comment.filter(c -> c.getPostId().equals(postId))
        .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public Comment updateComment(Long postId, Long commentId, Comment newComment) {
        Comment comment = getCommentById(postId, commentId);
        comment.setContent(newComment.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long postId, Long commentId) {
        Comment comment = getCommentById(postId, commentId);
        commentRepository.delete(comment);
    }
}