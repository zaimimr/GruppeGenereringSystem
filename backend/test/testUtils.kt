package com.gruppe7

import com.gruppe7.factories.UserFactory
import com.gruppe7.utils.JWTHandler
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.TestApplicationRequest
import io.ktor.server.testing.withTestApplication

fun withServer(block: TestApplicationEngine.() -> Unit) {
    withTestApplication({ module(testing = true) }, block)
}

fun TestApplicationRequest.addContentJsonHeader() =
    addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())

fun TestApplicationRequest.addJwtHeader() = addHeader("Authorization", "Bearer ${getToken()}")

private fun getToken() = JWTHandler.generateToken(UserFactory.testUser)
