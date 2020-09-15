package com.gruppe7.service

import com.gruppe7.model.*
import model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class UserService {

    private val listeners = mutableMapOf<Int, suspend (Notification<User?>) -> Unit>()

    fun addChangeListener(id: Int, listener: suspend (Notification<User?>) -> Unit) {
        listeners[id] = listener
    }

    fun removeChangeListener(id: Int) = listeners.remove(id)

    private suspend fun onChange(type: ChangeType, id: Int, entity: User? = null) {
        listeners.values.forEach {
            it.invoke(Notification(type, id, entity))
        }
    }

    suspend fun getUser(id: Int): User? = DatabaseFactory.dbQuery {
        Users.select {
            (Users.id eq id)
        }.mapNotNull { toUser(it) }
                .singleOrNull()
    }

    suspend fun addUser(user: NewUser): User {
        var key = 0
        DatabaseFactory.dbQuery {
            key = (Users.insert {
                it[name] = user.name
                it[email] = user.email
                it[password_hash] = user.password_hash
            } get Users.id)
        }
        return getUser(key)!!.also {
            onChange(ChangeType.CREATE, key, it)
        }
    }

    suspend fun getAllUsers(): List<User> = DatabaseFactory.dbQuery {
        Users.selectAll().map { toUser(it) }
    }

    suspend fun deleteAllUsers() : Int = DatabaseFactory.dbQuery {
        Users.deleteAll();
    }

    suspend fun deleteUser(id: Int): Boolean {
        return DatabaseFactory.dbQuery {
            Users.deleteWhere { Users.id eq id } > 0
        }.also {
            if (it) onChange(ChangeType.DELETE, id)
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