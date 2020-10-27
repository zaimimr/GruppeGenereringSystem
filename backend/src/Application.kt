package com.gruppe7

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import com.gruppe7.service.DatabaseFactory
import com.gruppe7.service.EventService
import com.gruppe7.service.UserService
import com.gruppe7.utils.JwtConfig
import com.gruppe7.utils.getSystemVariable
import com.gruppe7.web.auth
import com.gruppe7.web.event
import com.gruppe7.web.index
import com.gruppe7.web.socket
import com.gruppe7.web.user
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.auth.jwt.jwt
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.gson.gson
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.cio.websocket.pingPeriod
import io.ktor.http.cio.websocket.timeout
import io.ktor.jackson.jackson
import io.ktor.request.path
import io.ktor.routing.Routing
import io.ktor.websocket.WebSockets
import io.sentry.Sentry
import org.slf4j.event.Level
import java.time.Duration

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }

    Sentry.init(getSystemVariable("SENTRY_DNS"))
    val client = Sentry.getStoredClient()
    client.environment = getSystemVariable("SENTRY_ENV")
    client.serverName = getSystemVariable("SENTRY_SERVER_NAME")

    DatabaseFactory.init()

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        header(HttpHeaders.AccessControlAllowHeaders)
        header(HttpHeaders.ContentType)
        header(HttpHeaders.AccessControlAllowOrigin)
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    install(Authentication) {
        jwt {
            realm = "gen-g"
            verifier(JwtConfig.buildJwtVerifier())
            validate { jwtCredential -> JwtConfig.validateCredential(jwtCredential) }
        }
    }

    install(ContentNegotiation) {
        jackson {
            registerModule(JodaModule())
            enable(SerializationFeature.INDENT_OUTPUT)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        }
        gson {
        }
    }

    install(Routing) {
        auth(UserService())
        index()
        socket()
        event(EventService())
        user(UserService())
        authenticate {
            user(UserService())
        }
    }
}
