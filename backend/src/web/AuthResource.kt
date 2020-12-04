package com.gruppe7.web

import com.gruppe7.service.UserService
import com.gruppe7.utils.JWTHandler
import com.gruppe7.utils.types.LoginCredentials
import com.gruppe7.utils.types.RegistrationData
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import io.sentry.Sentry
import org.json.simple.JSONObject

/**
 * Authentication end-points
 *
 * Endpoints for login, registration and JTW verification
 *
 */

fun Route.auth(userService: UserService) {

    authenticate {
        /**
         * Endpoint verification JWT-token
         *
         */
        get("/verify") {
            call.respond(HttpStatusCode.OK)
        }
    }

    /**
     * Login Endpoint
     * @param email
     * @param password
     *
     */
    post("/login") {
        try {
            val loginData = call.receive<LoginCredentials>()
            val user = userService.findUserWithLoginCredentials(loginData)
            val token = JWTHandler.generateToken(user)
            val responseObject = JSONObject()
            responseObject["token"] = token
            responseObject["user"] = user
            call.respond(responseObject)
        } catch (e: Exception) {
            Sentry.capture(e)
            call.respond(HttpStatusCode.BadRequest, "Feil e-post eller passord")
        }
    }

/**
     * Sign Up Endpoint
     * @param name
     * @param email
     * @param password
     * @param repeatPassword
     *
     */
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
