package com.autoflex.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
class ProductResourceTest {

    @Test
    void listProducts_returnsOk() {
        given()
            .when()
            .get("/api/products")
            .then()
            .statusCode(200)
            .body(is(notNullValue()));
    }

    @Test
    void createAndGetProduct() {
        String body = "{\"code\":\"TEST-001\",\"name\":\"Test Product\",\"value\":99.99,\"rawMaterials\":[]}";
        given()
            .contentType("application/json")
            .body(body)
            .when()
            .post("/api/products")
            .then()
            .statusCode(201)
            .body("code", equalTo("TEST-001"))
            .body("name", equalTo("Test Product"))
            .body("value", equalTo(99.99f));
    }
}
