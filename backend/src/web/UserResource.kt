package com.gruppe7.web

import com.gruppe7.model.User
import com.gruppe7.service.UserService
import io.ktor.application.call
import io.ktor.auth.authentication
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.route
import org.json.simple.JSONObject
import java.util.UUID

fun Route.user(userService: UserService) {

    route("/user") {
        get("/") {
            val user = call.authentication.principal<User>()
            val responseObject = JSONObject()
            responseObject["user"] = user
            call.respond(responseObject)
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
