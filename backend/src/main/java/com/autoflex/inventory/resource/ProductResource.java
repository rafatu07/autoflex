package com.autoflex.inventory.resource;

import com.autoflex.inventory.dto.PageResponseDTO;
import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.service.ProductService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    public Object list(@QueryParam("page") @DefaultValue("0") int page,
                       @QueryParam("size") @DefaultValue("10") int size) {
        if (page >= 0 && size > 0) {
            return productService.findPage(page, size);
        }
        return productService.findAll();
    }

    @GET
    @Path("/{id}")
    public ProductDTO get(@PathParam("id") Long id) {
        return productService.findById(id);
    }

    @POST
    public Response create(@Valid ProductDTO dto) {
        ProductDTO created = productService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public ProductDTO update(@PathParam("id") Long id, @Valid ProductDTO dto) {
        return productService.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        productService.delete(id);
        return Response.noContent().build();
    }
}
