package com.gruppe7.web

import com.gruppe7.model.User
import com.gruppe7.utils.GenerateGroup.BruteForce
import com.gruppe7.utils.GenerateGroup.FlowNetwork
import com.gruppe7.utils.SendEmailSMTP
import com.gruppe7.utils.types.ApprovedGroupsData
import com.gruppe7.utils.types.CsvData
import com.gruppe7.utils.types.FilterData
import com.gruppe7.utils.types.Participant
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.auth.authentication
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

/**
 * Util end-points
 *
 * Endpoints for group generating function
 *
 */
fun Route.index() {

    get("/") {
        call.respondText("Velkommen til gruppegenerering", ContentType.Text.Plain)
    }

    authenticate {
        /**
         * Endpoint for sending email invitation to participants
         *
         */
        post("/invite/{event_id}") {
            try {
                val csvGroupList = call.receive<Array<CsvData>>()
                val eventID: String = call.parameters["event_id"]!!
                val participants = ArrayList<Participant>()
                for (csvGroup in csvGroupList) {
                    participants.addAll(csvGroup.getParticipants())
                }
                val responseObject = JSONObject()
                responseObject["participants"] = participants.toTypedArray()
                SendEmailSMTP().sendInvitation(participants.toTypedArray(), eventID)
                call.respond(responseObject)
            } catch (e: Exception) {
                Sentry.capture(e)
                e.printStackTrace()
                call.respond(HttpStatusCode.BadRequest, e.message ?: "Noe gikk galt under sending av invitasjon")
            }
        }

        /**
         * Endpoint for generating groups
         *
         */
        post("/generate") {
            try {
                val response = call.receive<FilterData>()
                val listOfParticipant = ArrayList<Participant>()
                for (participant in response.participants) {
                    listOfParticipant.add(
                        Participant(
                            participant.id,
                            participant.name,
                            participant.email,
                            participant.group
                        )
                    )
                }
                val groupGenerator = BruteForce()

                val groups = groupGenerator.solveWithBruteForce(
                    listOfParticipant,
                    response.filters.toCollection(ArrayList())
                )
                val responseObject = JSONObject()
                responseObject["isCriteria"] = groups.first
                responseObject["generatedGroups"] = groups.second.toTypedArray()
                responseObject["filters"] = response.filters
                call.respond(responseObject)
            } catch (e: Exception) {
                Sentry.capture(e)
                call.respond(HttpStatusCode.BadRequest, e.message ?: "Noe gikk galt under generering av grupper")
            }
        }
        /**
         * Endpoint for sending final groups to participants and coordinator
         *
         */
        post("/sendgroups") {
            try {
                val user = call.authentication.principal<User>()
                if (user == null) {
                    call.respond(HttpStatusCode.Unauthorized)
                } else {
                    val response = call.receive<ApprovedGroupsData>()
                    SendEmailSMTP().sendGroup(response.finalData, response.event, user.email)
                    call.respond(HttpStatusCode.OK)
                }
            } catch (e: Exception) {
                Sentry.capture(e)
                call.respond(HttpStatusCode.BadRequest, e.message ?: "Noe gikk galt under sending av grupper")
            }
        }
    }
    post("/test") {
        try {
            val response = call.receive<FilterData>()
            val listOfParticipant = ArrayList<Participant>()
            for (participant in response.participants) {
                listOfParticipant.add(
                    Participant(
                        participant.id,
                        participant.name,
                        participant.email,
                        participant.group
                    )
                )
            }
            val groupGenerator = FlowNetwork()

            val groups = groupGenerator.solveWithMaximumFlow(
                listOfParticipant,
                response.filters.toCollection(ArrayList())
            )
            val responseObject = JSONObject()
            responseObject["isCriteria"] = groups.first
            responseObject["generatedGroups"] = groups.second.toTypedArray()
            responseObject["filters"] = response.filters
            call.respond(responseObject)
        } catch (e: Exception) {
            Sentry.capture(e)
            call.respond(HttpStatusCode.BadRequest, e.message ?: "Noe gikk galt under generering av grupper")
        }
    }
}
