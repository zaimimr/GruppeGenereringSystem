package com.gruppe7.service

import com.gruppe7.model.User
import com.gruppe7.model.Users
import com.gruppe7.utils.exceptions.DuplicateEmailException
import com.gruppe7.utils.types.LoginCredentials
import com.gruppe7.utils.types.RegistrationData
import com.gruppe7.utils.validatePassword
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.springframework.security.crypto.bcrypt.BCrypt
import java.util.UUID

/**
 * User Service
 *
 * This class containes methodes to access and modify User data in database
 */
class UserService {
    /**
     * Add user to database.
     * @param user registration data
     * @throws DuplicateEmailException, @exception DuplicateEmailException
     * @return user
     */
    private val SALT_ROUNDS = 6
    suspend fun getAllUsers(): List<User> = DatabaseFactory.dbQuery {
        Users.selectAll().map { toUser(it) }
    }

    suspend fun addUser(user: RegistrationData) {
        try {
            validatePassword(user.password, user.repeatPassword)

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

    /**
     * Get user by id.
     * @param id User id
     * @return user
     */
    suspend fun getUser(id: UUID): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.id eq id)
        }.mapNotNull { toUser(it) }
            .singleOrNull()
    }

    /**
     * Get user by email.
     * @param email Unique user email
     * @return user
     */
    suspend fun getUser(email: String): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.email eq email)
        }.mapNotNull { toUser(it) }
            .singleOrNull()
    }

    /**
     * Delete user by id.
     * @param id User id
     * @return if user is deleted
     */
    suspend fun deleteUser(id: UUID): Boolean {
        return DatabaseFactory.dbQuery {
            Users.deleteWhere { Users.id eq id } > 0
        }
    }

    /**
     * Get user with login credentials
     * @param login information (email, password)
     * @throws IllegalArgumentException, @exception IllegalArgumentException
     * @return user
     */
    suspend fun findUserWithLoginCredentials(login: LoginCredentials): User {
        val user = UserService().getUser(login.email) ?: throw IllegalArgumentException("Bruker ikke funnet, feil e-post")
        if (BCrypt.checkpw(login.password, user.password))
            return user
        throw IllegalArgumentException("Feil passord")
    }

    /**
     * Format JSON to User object
     * @param row Event JSON data
     * @return User object
     */
    private fun toUser(row: ResultRow): User =
        User(
            id = row[Users.id],
            name = row[Users.name],
            email = row[Users.email],
            password = row[Users.password]
        )
}
