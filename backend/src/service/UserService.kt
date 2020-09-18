package com.gruppe7.service

import com.gruppe7.model.*
import model.*
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.lang.Exception
import java.sql.SQLException
import java.util.*
import com.toxicbakery.bcrypt.Bcrypt

class UserService {
    final val SALT_ROUNDS = 6;
    suspend fun getAllUsers(): List<User> = DatabaseFactory.dbQuery {
        Users.selectAll().map { toUser(it) }
    }

    suspend fun addUser(user: User): Boolean {
        return try {
            val hashedPassword = Bcrypt.hash(user.password_hash, SALT_ROUNDS).toString();
            val result = DatabaseFactory.dbQuery {
                Users.insert {
                    it[id] = UUID.randomUUID()
                    it[name] = user.name
                    it[email] = user.email
                    it[password_hash] = hashedPassword
                }
            }
            true;
        } catch (e : ExposedSQLException) {
            false;
        }
    }

    suspend fun getUser(id: UUID): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.id eq id)
        }.mapNotNull { toUser(it) }
                .singleOrNull()
    }

    suspend fun deleteAllUsers() : Int = DatabaseFactory.dbQuery {
        Users.deleteAll();
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