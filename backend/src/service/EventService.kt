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

/**
 * Event Service
 *
 * This class containes methodes to access and modify Event data in database
 */

class EventService {
    /**
     * Add an event to database.
     * @param event Event data
     * @param user User data
     * @return Created Event
     */
    suspend fun addEvent(event: CreateEventData, user: User): Event? {
        if (event.minimumPerGroup != 0 || event.maximumPerGroup != 0) {
            verifyMinMaxFilter(event.minimumPerGroup, event.maximumPerGroup)
        }

        val datetime = formatStringToDate(event.time)
        var key: UUID? = null
        DatabaseFactory.dbQuery {
            key = (
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
                } get Events.id
                )
        }
        return key?.let { getEvent(it) }
    }

    /**
     * Get all events created by user
     * @param user User data
     * @return All events
     */
    suspend fun getAllEventsCreatedByUser(user: User): List<Event> = DatabaseFactory.dbQuery {
        Events.select { Events.createdBy eq user.id }.map { toEvent(it) }
    }
    /**
     * Get event by uuid
     * @param id Event id
     * @return event
     */
    suspend fun getEvent(id: UUID): Event? = DatabaseFactory.dbQuery {
        Events.select { (Events.id eq id) }.mapNotNull { toEvent(it) }.singleOrNull()
    }

    /**
     * Delete event by uuid
     * @param id Event id
     */
    suspend fun deleteEvent(id: UUID): Boolean {
        return DatabaseFactory.dbQuery {
            Events.deleteWhere { Events.id eq id } > 0
        }
    }
    /**
     * Update event by uuid
     * @param id Event id
     * @param event updated event data
     * @return event
     */
    suspend fun updateEvent(id: UUID, event: UpdateEventData): Boolean {
        if (event.minimumPerGroup != 0 || event.maximumPerGroup != 0) {
            verifyMinMaxFilter(event.minimumPerGroup, event.maximumPerGroup)
        }
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

    /**
     * Format JSON to Event object
     * @param row Event JSON data
     * @return event object
     */
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
