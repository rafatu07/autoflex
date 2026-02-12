package com.autoflex.inventory.resource;

import com.autoflex.inventory.service.ConflictException;
import com.autoflex.inventory.service.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class InventoryExceptionMapper implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof NotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", exception.getMessage()))
                    .build();
        }
        if (exception instanceof ConflictException) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("message", exception.getMessage()))
                    .build();
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("message", exception.getMessage() != null ? exception.getMessage() : "Internal error"))
                .build();
    }
}
