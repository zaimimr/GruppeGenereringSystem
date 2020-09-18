package com.gruppe7.web

import com.gruppe7.model.User
import com.gruppe7.service.UserService
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import java.util.UUID

fun Route.user(userService: UserService) {

    route("/user") {
        get("/") {
            call.respond(userService.getAllUsers())
        }


        post("/") {
            val newUser = call.receive<User>()
            val status = userService.addUser(newUser)
            if (status) call.respond(HttpStatusCode.Created)
            else call.respond(HttpStatusCode.Conflict)
        }

        get("/{id}") {
            val id: UUID = UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide id")
            val user = userService.getUser(id)
            if (user != null) call.respond(user)
            else call.respond(HttpStatusCode.NotFound)
        }

        delete("/{id}") {
            val id: UUID = UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide id")
            val removed = userService.deleteUser(id)
            if (removed) call.respond(HttpStatusCode.OK)
            else call.respond(HttpStatusCode.NotFound)
        }
    }
}
