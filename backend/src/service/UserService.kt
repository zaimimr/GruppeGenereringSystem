package com.gruppe7.service

import com.gruppe7.model.User
import com.gruppe7.model.Users
import com.gruppe7.utils.exceptions.DuplicateEmailException
import com.gruppe7.utils.types.LoginCredentials
import com.gruppe7.utils.types.RegistrationData
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.springframework.security.crypto.bcrypt.BCrypt
import java.util.UUID

class UserService {
    private final val SALT_ROUNDS = 6
    suspend fun getAllUsers(): List<User> = DatabaseFactory.dbQuery {
        Users.selectAll().map { toUser(it) }
    }

    suspend fun addUser(user: RegistrationData) {
        try {
            if (user.password != user.repeatPassword) {
                throw IllegalArgumentException("Passord må være like")
            }
            val hashedPassword = BCrypt.hashpw(user.password, BCrypt.gensalt(SALT_ROUNDS))
            DatabaseFactory.dbQuery {
                Users.insert {
                    it[id] = UUID.randomUUID()
                    it[name] = user.name
                    it[email] = user.email
                    it[password] = hashedPassword
                }
            }
        } catch (e: ExposedSQLException) {
            throw DuplicateEmailException("E-post adressen er allerede i bruk")
        }
    }

    suspend fun getUser(id: UUID): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.id eq id)
        }.mapNotNull { toUser(it) }
            .singleOrNull()
    }

    suspend fun getUser(email: String): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.email eq email)
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

    suspend fun findUserWithLoginCredentials(login: LoginCredentials): User {
        val user = UserService().getUser(login.email) ?: throw IllegalArgumentException("Bruker ikke funnet, feil e-post")
        if (BCrypt.checkpw(login.password, user.password))
            return user
        throw IllegalArgumentException("Feil passord")
    }

    private fun toUser(row: ResultRow): User =
        User(
            id = row[Users.id],
            name = row[Users.name],
            email = row[Users.email],
            password = row[Users.password],
            socket_id = row[Users.socket_id]
        )
}
