package com.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TodoBackendApplicationTest {
    @Test
    void contextLoads() {
        // Context load test
    }

    @Test
    void mainRuns() {
        TodoBackendApplication.main(new String[] {});
    }
}