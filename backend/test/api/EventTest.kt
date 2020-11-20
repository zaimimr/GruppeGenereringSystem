package com.gruppe7.api

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.gruppe7.addContentJsonHeader
import com.gruppe7.addJwtHeader
import com.gruppe7.factories.EventFactory
import com.gruppe7.model.Event
import com.gruppe7.utils.serializers.DateTimeDeserializer
import com.gruppe7.utils.types.CreateEventData
import com.gruppe7.withServer
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.setBody
import org.joda.time.DateTime
import kotlin.test.Test

class EventTest {
    private val baseURL = "/event/"

    @Test
    fun `Test add event without token`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = baseURL
            addContentJsonHeader()
            setBody(
                Gson().toJson(
                    EventFactory.createEventData(minimumPerGroup = 2, maximumPerGroup = 3)
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.Unauthorized)
    }

    @Test
    fun `Test add event with valid data`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = baseURL
            addContentJsonHeader()
            addJwtHeader()
            setBody(
                Gson().toJson(
                    EventFactory.createEventData(minimumPerGroup = 2, maximumPerGroup = 8)
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.Created)
    }

    @Test
    fun `Test add event with mismatching filters`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = baseURL
            addContentJsonHeader()
            addJwtHeader()
            setBody(
                Gson().toJson(
                    EventFactory.createEventData(minimumPerGroup = 5, maximumPerGroup = 2)
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
    }

    @Test
    fun `Test add event with negative numbers in filter`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = baseURL
            addContentJsonHeader()
            addJwtHeader()
            setBody(
                Gson().toJson(
                    EventFactory.createEventData(minimumPerGroup = -2, maximumPerGroup = -5)
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
    }

    @Test
    fun `Test add event with wrong date format`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = baseURL
            addContentJsonHeader()
            addJwtHeader()
            setBody(
                Gson().toJson(
                    EventFactory.createEventData("31/31/2020 12:00", 2, 3)
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
    }

    @Test
    fun `Test get event by ID`() = withServer {
        val gson = GsonBuilder().registerTypeAdapter(
            DateTime::class.java,
            DateTimeDeserializer()
        ).create()
        val request = handleRequest {
            method = HttpMethod.Get
            uri = "$baseURL${EventFactory.testEvent.id}"
            addJwtHeader()
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.OK)
        val event = gson.fromJson(request.response.content, Event::class.java)
        assert(event!! == EventFactory.testEvent)
    }

    @Test
    fun `Test delete event`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Delete
            uri = "$baseURL/${EventFactory.testEvent.id}"
            addJwtHeader()
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.OK)
    }

    @Test
    fun `Test update event`() = withServer {
        val gson = GsonBuilder().registerTypeAdapter(
            DateTime::class.java,
            DateTimeDeserializer()
        ).create()
        val request = handleRequest {
            method = HttpMethod.Put
            uri = "$baseURL/${EventFactory.testEvent.id}"
            addContentJsonHeader()
            addJwtHeader()
            setBody(
                gson.toJson(
                    CreateEventData(
                        "I have been changed",
                        "This is the ingress of the event",
                        "Gløshaugen",
                        "12/12/2020 10:10",
                        "This is the description",
                        1,
                        5
                    )
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.OK)

        val request2 = handleRequest {
            method = HttpMethod.Get
            uri = "$baseURL/${EventFactory.testEvent.id}"
            addContentJsonHeader()
            addJwtHeader()
        }
        assert(request2.response.status() == HttpStatusCode.OK)
        val updatedEvent = gson.fromJson(request2.response.content, Event::class.java)
        assert(updatedEvent!!.title == "I have been changed")
    }
}
