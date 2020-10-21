package com.gruppe7.web

import com.gruppe7.service.UserService
import com.gruppe7.utils.JwtConfig
import com.gruppe7.utils.types.LoginCredentials
import com.gruppe7.utils.types.RegistrationData
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import io.sentry.Sentry
import org.json.simple.JSONObject

fun Route.auth(userService: UserService) {

    authenticate {
        get("/verify") {
            call.respondText("Verify", ContentType.Text.Plain)
        }
    }

    post("/login") {
        try {
            val loginData = call.receive<LoginCredentials>()
            val user = userService.findUserWithLoginCredentials(loginData)
            val token = JwtConfig.generateToken(user)
            val responseObject = JSONObject()
            responseObject["token"] = token
            responseObject["user"] = user
            call.respond(responseObject)
        } catch (e: Exception) {
            Sentry.capture(e)
            call.respond(HttpStatusCode.BadRequest, "Feil e-post eller passord")
        }
    }

    post("/register") {
        try {
            val registrationData = call.receive<RegistrationData>()
            userService.addUser(registrationData)
            call.respond(HttpStatusCode.Created)
        } catch (e: Exception) {
            Sentry.capture(e)
            call.respond(HttpStatusCode.BadRequest, e.message!!)
        }
    }
}
