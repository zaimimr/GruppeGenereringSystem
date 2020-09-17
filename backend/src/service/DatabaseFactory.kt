package com.gruppe7.service

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.github.cdimascio.dotenv.dotenv
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

object DatabaseFactory {

    fun init() {
        Database.connect(hikari())
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
        block: suspend () -> T
    ): T =
        newSuspendedTransaction { block() }
}
