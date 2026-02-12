package com.autoflex.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
class ProductionSuggestionResourceTest {

    @Test
    void getProductionSuggestion_returnsOk() {
        given()
            .when()
            .get("/api/production-suggestion")
            .then()
            .statusCode(200)
            .body("items", notNullValue())
            .body("totalValue", notNullValue());
    }
}
