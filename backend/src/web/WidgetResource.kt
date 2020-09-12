package com.gruppe7.web

import com.gruppe7.service.WidgetService
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.*
import model.NewWidget

fun Route.widget(widgetService: WidgetService) {

    route("/widget") {

        get("/") {
            call.respond(widgetService.getAllWidgets())
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalStateException("Must provide id")
            val widget = widgetService.getWidget(id)
            if (widget == null) call.respond(HttpStatusCode.NotFound)
            else call.respond(widget)
        }

        post("/") {
            val widget = call.receive<NewWidget>()
            call.respond(HttpStatusCode.Created, widgetService.addWidget(widget))
        }

        put("/") {
            val widget = call.receive<NewWidget>()
            val updated = widgetService.updateWidget(widget)
            if (updated == null) call.respond(HttpStatusCode.NotFound)
            else call.respond(HttpStatusCode.OK, updated)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalStateException("Must provide id");
            val removed = widgetService.deleteWidget(id)
            if (removed) call.respond(HttpStatusCode.OK)
            else call.respond(HttpStatusCode.NotFound)
        }

    }
}
