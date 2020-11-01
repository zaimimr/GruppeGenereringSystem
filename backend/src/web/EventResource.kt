package com.gruppe7.web

import com.gruppe7.model.User
import com.gruppe7.service.EventService
import com.gruppe7.utils.exceptions.UnauthorizedException
import com.gruppe7.utils.types.CreateEventData
import com.gruppe7.utils.types.UpdateEventData
import com.gruppe7.utils.verifyUser
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.auth.authentication
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.put
import io.ktor.routing.route
import io.sentry.Sentry
import java.lang.IllegalArgumentException
import java.lang.IllegalStateException
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.UUID

fun Route.event(eventService: EventService) {
    route("/event") {

        authenticate {
            get("/") {
                val user = call.authentication.principal<User>()
                if (user == null) {
                    call.respond(HttpStatusCode.Unauthorized)
                } else {
                    val events = eventService.getAllEventsCreatedByUser(user)
                    val todaysDate = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT).plusDays(-1)
                    val eventsAfterToday = events.filter { LocalDateTime.parse(it.time.toString().split(".")[0].replace("T", " "), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")).isAfter(todaysDate) }
                    call.respond(eventsAfterToday)
                }
            }

            post("/") {
                try {
                    val user = call.authentication.principal<User>()
                    if (user == null) {
                        call.respond(HttpStatusCode.Unauthorized)
                    } else {
                        val eventData = call.receive<CreateEventData>()
                        val createdEvent = eventService.addEvent(eventData, user)
                        call.respond(HttpStatusCode.Created, createdEvent!!)
                    }
                } catch (e: IllegalArgumentException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.BadRequest, e.message!!)
                } catch (e: Exception) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.BadRequest, e.message!!)
                }
            }
            get("/{id}") {
                try {
                    val user = call.authentication.principal<User>()
                    val id: UUID =
                        UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide ID")
                    val event = eventService.getEvent(id)
                    if (event != null) {
                        verifyUser(event, user)
                        call.respond(event)
                    } else call.respond(HttpStatusCode.NotFound)
                } catch (e: IllegalArgumentException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.BadRequest, e.message!!)
                } catch (e: UnauthorizedException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.Unauthorized, e.message!!)
                }
            }

            put("/{id}") {
                try {
                    val user = call.authentication.principal<User>()
                    val id: UUID =
                        UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide ID")
                    val updateEventData = call.receive<UpdateEventData>()
                    val event = eventService.getEvent(id)
                    if (event != null) {
                        verifyUser(event, user)
                        val isEventUpdated = eventService.updateEvent(id, updateEventData)
                        if (isEventUpdated) call.respond(HttpStatusCode.OK)
                        else call.respond(HttpStatusCode.NotFound)
                    }
                } catch (e: IllegalArgumentException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.BadRequest, e.message!!)
                } catch (e: UnauthorizedException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.Unauthorized, e.message!!)
                }
            }

            delete("/{id}") {
                try {
                    val user = call.authentication.principal<User>()
                    val id: UUID =
                        UUID.fromString(call.parameters["id"]) ?: throw IllegalStateException("Must provide ID")
                    val event = eventService.getEvent(id)
                    if (event != null) {
                        verifyUser(event, user)
                        val isEventDeleted = eventService.deleteEvent(id)
                        if (isEventDeleted) call.respond(HttpStatusCode.OK)
                        else call.respond(HttpStatusCode.InternalServerError)
                    } else call.respond(HttpStatusCode.NotFound)
                } catch (e: IllegalArgumentException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.BadRequest, e.message!!)
                } catch (e: UnauthorizedException) {
                    Sentry.capture(e)
                    call.respond(HttpStatusCode.Unauthorized, e.message!!)
                }
            }
        }
    }
}
