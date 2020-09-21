package com.gruppe7.model

import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import java.util.UUID

object Users : Table() {
    val id: Column<UUID> = uuid("id")
    val name: Column<String> = varchar("name", 45)
    val email: Column<String> = varchar("email", 45).uniqueIndex()
    val password_hash: Column<String> = varchar("password_hash", 200)
    val socket_id: Column<Int?> = (integer("socket_id")).nullable()
    override val primaryKey = PrimaryKey(id, name = "PK_User_ID")
}

data class User(
    val id: UUID,
    val name: String,
    val email: String,
    val password_hash: String,
    val socket_id: Int?
)
