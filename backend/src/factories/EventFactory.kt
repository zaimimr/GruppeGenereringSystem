package com.gruppe7.factories

import com.gruppe7.model.Event
import com.gruppe7.utils.types.CreateEventData
import org.joda.time.DateTime
import java.util.UUID

/**
 * Singleton EventFactory to create events for tests
 */
object EventFactory {
    val testEvent = Event(
        UUID.randomUUID(),
        "Title of event",
        "Ingress of event",
        "Trondheim",
        DateTime.now().plusHours(6),
        "Description of event",
        1,
        5,
        DateTime.now(),
        UserFactory.testUser.id
    )

    fun event(dateTime: DateTime, minimumPerGroup: Int, maximumPerGroup: Int): Event {
        return Event(
            UUID.randomUUID(),
            "Title of event",
            "Ingress of event",
            "Trondheim",
            dateTime,
            "Description of event",
            minimumPerGroup,
            maximumPerGroup,
            DateTime.now(),
            UserFactory.testUser.id
        )
    }

    fun createEventData(dateTime: String = "12/12/2020 12:00", minimumPerGroup: Int, maximumPerGroup: Int): CreateEventData {
        return CreateEventData(
            "Title of event",
            "Ingress of event",
            "Trondheim",
            dateTime,
            "Description of event",
            minimumPerGroup,
            maximumPerGroup
        )
    }
}
