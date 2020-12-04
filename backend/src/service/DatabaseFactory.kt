package com.gruppe7.service

import com.gruppe7.factories.EventFactory
import com.gruppe7.factories.UserFactory
import com.gruppe7.model.Events
import com.gruppe7.model.Users
import com.gruppe7.utils.getSystemVariable
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.SchemaUtils.drop
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * DatabaseFactory
 *
 * This object initialtes database connection
 *
 * @constructor Initiate database with hikari and create user and event table
 */

object DatabaseFactory {

    fun init(testing: Boolean) {
        Database.connect(hikari(testing))
        transaction {
            create(Users)
            create(Events)
        }
        if (testing) {
            seedData()
        }
    }

    fun dropTables() {
        transaction {
            drop(Events)
            drop(Users)
        }
    }

    private fun seedData() {
        transaction {
            Users.insert {
                it[id] = UserFactory.testUser.id
                it[name] = UserFactory.testUser.name
                it[email] = UserFactory.testUser.email
                it[password] = UserFactory.testUser.password
            }
            val testEvent = EventFactory.testEvent
            Events.insert {
                it[id] = testEvent.id
                it[title] = testEvent.title
                it[ingress] = testEvent.ingress
                it[place] = testEvent.place
                it[time] = testEvent.time
                it[description] = testEvent.description
                it[minimumPerGroup] = testEvent.minimumPerGroup
                it[maximumPerGroup] = testEvent.maximumPerGroup
                it[dateCreated] = testEvent.dateCreated
                it[createdBy] = testEvent.createdBy
            }
        }
    }

    private fun hikari(testing: Boolean): HikariDataSource {
        val config = HikariConfig()
        config.driverClassName = "com.mysql.cj.jdbc.Driver"
        config.jdbcUrl = if (testing) {
            if (getSystemVariable("ENVIRONMENT") == "CI") {
                "jdbc:mysql://mysql:3306/gruppegen"
            } else {
                "jdbc:mysql://localhost:3306/gruppegen"
            }
        } else getSystemVariable("DATABASE_URL")
        config.username = if (testing) "root" else getSystemVariable("DATABASE_USERNAME")
        config.password = if (testing) "secret" else getSystemVariable("DATABASE_PASSWORD")
        config.maximumPoolSize = 3
        config.isAutoCommit = false
        config.transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        config.validate()
        return HikariDataSource(config)
    }

    suspend fun <T> dbQuery(
        block: suspend () -> T
    ): T =
        newSuspendedTransaction { block() }
}
