package com.gruppe7.web

import com.gruppe7.utils.GroupGenerator
import com.gruppe7.utils.SendEmailSMTP
import com.gruppe7.utils.types.ApprovedGroupsData
import com.gruppe7.utils.types.CsvData
import com.gruppe7.utils.types.FilterData
import com.gruppe7.utils.types.Participant
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import org.json.simple.JSONObject

fun Route.index() {

    get("/") {
        call.respondText("Velkommen til gruppegenerering", ContentType.Text.Plain)
    }

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
            e.printStackTrace()
            call.respond(HttpStatusCode.BadRequest)
        }
    }

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
            val groupGenerator = GroupGenerator()
            val groups = groupGenerator.groupGeneratorWithDynamicScore(
                listOfParticipant,
                response.minimumPerGroup,
                response.maximumPerGroup
            )
            val responseObject = JSONObject()
            responseObject["isCriteria"] = groups.first
            responseObject["generatedGroups"] = groups.second.toTypedArray()
            call.respond(responseObject)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.BadRequest)
        }
    }

    post("/sendgroups") {
        try {
            val response = call.receive<ApprovedGroupsData>()
            SendEmailSMTP().sendGroup(response.finalData, response.event, response.coordinatorEmail)
            call.respond(HttpStatusCode.OK)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.BadRequest)
        }
    }
}
