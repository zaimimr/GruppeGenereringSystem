package com.gruppe7.service

import com.gruppe7.model.Event
import com.gruppe7.model.Events
import com.gruppe7.model.User
import com.gruppe7.utils.formatStringToDate
import com.gruppe7.utils.types.CreateEventData
import com.gruppe7.utils.types.UpdateEventData
import com.gruppe7.utils.verifyMinMaxFilter
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.update
import java.util.UUID

class EventService {
    suspend fun addEvent(event: CreateEventData, user: User) {
        verifyMinMaxFilter(event.minimumPerGroup, event.maximumPerGroup)

        val datetime = formatStringToDate(event.time)

        DatabaseFactory.dbQuery {
            Events.insert {
                it[id] = UUID.randomUUID()
                it[title] = event.title
                it[ingress] = event.ingress
                it[place] = event.place
                it[time] = datetime
                it[description] = event.description
                it[minimumPerGroup] = event.minimumPerGroup
                it[maximumPerGroup] = event.maximumPerGroup
                it[createdBy] = user.id
            }
        }
    }

    suspend fun getAllEventsCreatedByUser(user: User): List<Event> = DatabaseFactory.dbQuery {
        Events.select { Events.createdBy eq user.id }.map { toEvent(it) }
    }

    suspend fun getEvent(id: UUID): Event? = DatabaseFactory.dbQuery {
        Events.select { (Events.id eq id) }.mapNotNull { toEvent(it) }.singleOrNull()
    }

    suspend fun deleteEvent(id: UUID): Boolean {
        return DatabaseFactory.dbQuery {
            Events.deleteWhere { Events.id eq id } > 0
        }
    }

    suspend fun updateEvent(id: UUID, event: UpdateEventData): Boolean {
        verifyMinMaxFilter(event.minimumPerGroup, event.maximumPerGroup)

        val datetime = formatStringToDate(event.time)
        return DatabaseFactory.dbQuery {
            Events.update({ Events.id eq id }) {
                it[title] = event.title
                it[ingress] = event.ingress
                it[place] = event.place
                it[time] = datetime
                it[description] = event.description
                it[minimumPerGroup] = event.minimumPerGroup
                it[maximumPerGroup] = event.maximumPerGroup
            }
        } > 0
    }

    private fun toEvent(row: ResultRow): Event =
        Event(
            id = row[Events.id],
            title = row[Events.title],
            ingress = row[Events.ingress],
            place = row[Events.place]!!,
            time = row[Events.time],
            description = row[Events.description],
            minimumPerGroup = row[Events.minimumPerGroup],
            maximumPerGroup = row[Events.maximumPerGroup],
            dateCreated = row[Events.dateCreated],
            createdBy = row[Events.createdBy]
        )
}
