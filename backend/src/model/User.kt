package com.gruppe7.model

import io.ktor.auth.Principal
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import java.util.UUID

/**
 * User model
 *
 * User object in database
 *
 */
object Users : Table() {
    val id: Column<UUID> = uuid("id")
    val name: Column<String> = varchar("name", 45)
    val email: Column<String> = varchar("email", 45).uniqueIndex()
    val password: Column<String> = varchar("password", 200)
    override val primaryKey = PrimaryKey(id, name = "PK_User_ID")
}

data class User(
    val id: UUID,
    val name: String,
    val email: String,
    @Transient val password: String,
) : Principal
