package com.gruppe7.web

import com.gruppe7.model.User
import com.gruppe7.service.UserService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import java.util.*

fun Route.user(userService: UserService) {


    route("/user") {
        get("/") {
            call.respond(userService.getAllUsers())
        }

        post("/") {
            val newUser = call.receive<User>();
            val status = userService.addUser(newUser);
            if (status) call.respond(HttpStatusCode.Created)
            else call.respond(HttpStatusCode.Conflict);
        }

        get("/{id}") {
            val id : UUID = UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide id");
            val user = userService.getUser(id);
            if (user == null) call.respond(HttpStatusCode.NotFound)
            else call.respond(user)
        }

        delete("/{id}") {
            val id : UUID = UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide id");
            val removed = userService.deleteUser(id);
            if (removed) call.respond(HttpStatusCode.OK)
            else call.respond(HttpStatusCode.NotFound)
        }
    }
}