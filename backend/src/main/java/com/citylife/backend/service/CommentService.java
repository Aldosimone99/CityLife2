package com.citylife.backend.service;

import com.citylife.backend.model.Comment;
import com.citylife.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(Long postId, Comment comment) {
        comment.setPostId(postId);
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