package com.gruppe7.web

import com.gruppe7.model.ApprovedGroupsData
import com.gruppe7.model.GenerateGroupData
import com.gruppe7.model.Participant
import com.gruppe7.utils.GroupGenerator
import com.gruppe7.utils.SendEmailSMTP
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

    post("/generate") {
        val response = call.receive<GenerateGroupData>()
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
        responseObject["criteriaSucceed"] = groups.first
        responseObject["groups"] = groups.second.toTypedArray()

        call.respond(responseObject)
    }

    post("/sendgroups") {
        val response = call.receive<ApprovedGroupsData>()
        val emailSMTP = SendEmailSMTP()
        if (emailSMTP.sendGroup(response.groups, response.event, response.emailCoordinator)) call.respond(HttpStatusCode.OK)
        else call.respond(HttpStatusCode.BadRequest)
    }
}
