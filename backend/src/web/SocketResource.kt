package com.gruppe7.web

import io.ktor.http.cio.websocket.DefaultWebSocketSession
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.readBytes
import io.ktor.http.cio.websocket.readText
import io.ktor.routing.Route
import io.ktor.websocket.webSocket
import java.util.Collections
import kotlin.collections.LinkedHashSet

class CoordinatorClient(val session: DefaultWebSocketSession, val eventID: String) {
    var participants: ByteArray? = null
}

fun Route.socket() {

    val coordinators = Collections.synchronizedSet(LinkedHashSet<CoordinatorClient>())

    // Ex: ws://localhost:8000/connect/EVENT_ID/PARTICIPANT_ID
    // or  ws://localhost:8000/connect/EVENT_ID?access_token=ACCESS_TOKEN
    webSocket("/connect/{event_id}/{participant_id?}") {
        val eventID: String = call.parameters["event_id"]!!
        val accessToken: String? = call.parameters["access_token"]
        val participantID: String? = call.parameters["participant_id"]
        if (validToken(accessToken)) {
            val coordinator = CoordinatorClient(this, eventID!!)
            coordinators += coordinator
            try {
                while (true) {
                    val frame = incoming.receive()
                    when (frame) {
                        is Frame.Text -> {
                            frame.readText()
                            // TODO: Istedenfor å sende med ParticipantID, send heller med participant objekt
                        }
                        is Frame.Binary -> {
                            // TODO: Sende meg kandidatdata i binary og bruke dette til å sende en og en kandidat fra backend til frontend
                            val participants = frame.readBytes()
                            coordinator.participants = participants
                        }
                    }
                }
            } finally {
                coordinators -= coordinator
            }
        } else {
            val coordinator: CoordinatorClient? = coordinators.find { it.eventID == eventID }
            if (coordinator != null) {
                coordinator.session.outgoing.send(Frame.Text(participantID!!))
                this.outgoing.send(Frame.Text("Registrering fullførst"))
            }
        }
    }
}

// TODO: Valider token med JWT
fun validToken(accessToken: String?): Boolean {
    return !accessToken.isNullOrBlank()
}
