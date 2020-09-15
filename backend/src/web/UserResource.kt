package com.gruppe7.web

import com.gruppe7.model.NewUser
import com.gruppe7.service.UserService
import com.gruppe7.service.WidgetService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.user(userService: UserService) {


    route("/user") {
        get("/") {
            call.respond(userService.getAllUsers())
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalStateException("Must provide id");
            val user = userService.getUser(id);
            if (user == null) call.respond(HttpStatusCode.NotFound)
            else call.respond(user)
        }

        post("/") {
            val newUser = call.receive<NewUser>();
            println(newUser);
            call.respond(HttpStatusCode.Created, userService.addUser(newUser))
        }


        delete("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalStateException("Must provide id");
            val removed = userService.deleteUser(id);
            if (removed) call.respond(HttpStatusCode.OK)
            else call.respond(HttpStatusCode.NotFound)
        }
    }
}