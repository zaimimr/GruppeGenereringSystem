package com.gruppe7.service

import com.gruppe7.model.User
import com.gruppe7.model.Users
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import model.Widgets
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import io.github.cdimascio.dotenv.dotenv

object DatabaseFactory {

    fun init() {
        Database.connect(hikari())
        transaction {
            create(Users);


            /*
            Users.insert {
                it[name] = "Max T. Schau";
                it[email] = "max.torre.schau@gmail.com";
                it[password_hash] = "sdkjfkdjsf";

            }

            Users.insert {
                it[name] = "Zaim Imran";
                it[email] = "zaim.imran@gmail.com";
                it[password_hash] = "hgjghjghjfthrth23";

            }

             */




        }
        /*

        transaction {
            create(Widgets)
            Widgets.insert {
                it[name] = "widget one"
                it[quantity] = 27
                it[dateUpdated] = System.currentTimeMillis()
            }
            Widgets.insert {
                it[name] = "widget two"
                it[quantity] = 14
                it[dateUpdated] = System.currentTimeMillis()
            }
        }

         */
    }

    private fun hikari(): HikariDataSource {
        val dotenv = dotenv()
        val config = HikariConfig()
        config.driverClassName = "com.mysql.cj.jdbc.Driver"
        config.jdbcUrl = dotenv["DATABASE_URL"]
        config.username = dotenv["DATABASE_USERNAME"]
        config.password = dotenv["DATABASE_PASSWORD"]
        config.maximumPoolSize = 3
        config.isAutoCommit = false
        config.transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        config.validate()
        return HikariDataSource(config)
    }

    suspend fun <T> dbQuery(
            block: suspend () -> T): T =
            newSuspendedTransaction { block() }

}