package com.citylife.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test")
    public String testConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return "Connection successful";
        } catch (Exception e) {
            return "Connection failed: " + e.getMessage();
        }
    }

    @GetMapping("/tables")
    public List<Map<String, Object>> getTables() {
        String sql = "SELECT table_schema, table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/users/columns")
    public List<Map<String, Object>> getUsersColumns() {
        String sql = "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/posts/columns")
    public List<Map<String, Object>> getPostsColumns() {
        String sql = "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'posts'";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/execute")
    public String executeSql(@RequestParam String sql) {
        try {
            jdbcTemplate.execute(sql);
            return "Query executed successfully";
        } catch (Exception e) {
            return "Query execution failed: " + e.getMessage();
        }
    }
}