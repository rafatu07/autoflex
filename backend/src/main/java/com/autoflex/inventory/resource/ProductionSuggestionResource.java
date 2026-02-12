package com.autoflex.inventory.resource;

import com.autoflex.inventory.dto.ProductionSuggestionResponseDTO;
import com.autoflex.inventory.service.ProductionSuggestionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/production-suggestion")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionSuggestionResource {

    @Inject
    ProductionSuggestionService productionSuggestionService;

    @GET
    public ProductionSuggestionResponseDTO get() {
        return productionSuggestionService.compute();
    }
}
