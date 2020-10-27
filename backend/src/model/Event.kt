package com.gruppe7.model

import com.fasterxml.jackson.annotation.JsonFormat
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.jodatime.CurrentDateTime
import org.jetbrains.exposed.sql.jodatime.datetime
import org.joda.time.DateTime
import java.util.UUID

object Events : Table() {
    val id: Column<UUID> = uuid("id")
    val title: Column<String> = varchar("title", 50)
    val ingress: Column<String> = varchar("ingress", 100)
    val place: Column<String?> = varchar("place", 50).nullable()
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    val time: Column<DateTime> = datetime("date")
    val description: Column<String> = varchar("description", 350)
    val minimumPerGroup: Column<Int> = integer("minimumPerGroup")
    val maximumPerGroup: Column<Int> = integer("maximumPerGroup")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    val dateCreated: Column<DateTime> = datetime("dateCreated").defaultExpression(CurrentDateTime())
    val createdBy: Column<UUID> = uuid("createdBy") references Users.id
    override val primaryKey = PrimaryKey(id, name = "pk_event_id")
}

data class Event(
    val id: UUID,
    val title: String,
    val ingress: String,
    val place: String,
    val time: DateTime,
    val description: String,
    val minimumPerGroup: Int,
    val maximumPerGroup: Int,
    val dateCreated: DateTime,
    val createdBy: UUID
)
