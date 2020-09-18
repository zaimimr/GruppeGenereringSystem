package com.gruppe7.service

import com.gruppe7.model.User
import com.gruppe7.model.Users
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.springframework.security.crypto.bcrypt.BCrypt
import java.util.UUID

class UserService {
    private final val saltRounds = 6
    suspend fun getAllUsers(): List<User> = DatabaseFactory.dbQuery {
        Users.selectAll().map { toUser(it) }
    }

    suspend fun addUser(user: User): Boolean {
        return try {
            val hashedPassword = BCrypt.hashpw(user.password_hash, BCrypt.gensalt(saltRounds))
            val result = DatabaseFactory.dbQuery {
                Users.insert {
                    it[id] = UUID.randomUUID()
                    it[name] = user.name
                    it[email] = user.email
                    it[password_hash] = hashedPassword
                }
            }
            true
        } catch (e: ExposedSQLException) {
            false
        }
    }

    suspend fun getUser(id: UUID): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.id eq id)
        }.mapNotNull { toUser(it) }
            .singleOrNull()
    }

    suspend fun deleteAllUsers(): Int = DatabaseFactory.dbQuery {
        Users.deleteAll()
    }

    suspend fun deleteUser(id: UUID): Boolean {
        return DatabaseFactory.dbQuery {
            Users.deleteWhere { Users.id eq id } > 0
        }
    }

    private fun toUser(row: ResultRow): User =
        User(
            id = row[Users.id],
            name = row[Users.name],
            email = row[Users.email],
            password_hash = row[Users.password_hash],
            socket_id = row[Users.socket_id]
        )
}
