package com.gruppe7.web

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get

fun Route.index() {

    get("/") {
        call.respondText("Velkommen til gruppegenerering", ContentType.Text.Plain)
    }
}
