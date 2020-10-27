package com.gruppe7.utils

import com.gruppe7.model.Event
import com.gruppe7.model.User
import com.gruppe7.utils.exceptions.UnauthorizedException
import io.github.cdimascio.dotenv.dotenv
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import java.lang.IllegalArgumentException

val dotenv = dotenv {
    ignoreIfMalformed = true
    ignoreIfMissing = true
}
fun getSystemVariable(variableKey: String): String? {
    val systemVariable = System.getenv(variableKey) ?: dotenv[variableKey]
    if (systemVariable != null) return systemVariable
    throw NullPointerException()
}

fun formatStringToDate(date: String): DateTime {
    val formatter = DateTimeFormat.forPattern("dd/MM/yyyy HH:mm")
    return formatter.parseDateTime(date)
}

fun verifyMinMaxFilter(minimumPerGroup: Int, maximumPerGroup: Int) {
    if (minimumPerGroup <= 0) {
        throw IllegalArgumentException("Minimum per gruppe må være større enn 0")
    }

    if (maximumPerGroup <= 0) {
        throw IllegalArgumentException("Maksimum per gruppe må være større enn 0")
    }

    if (minimumPerGroup > maximumPerGroup) {
        throw IllegalArgumentException("Maksimum per gruppe må være større eller lik minimum per gruppe")
    }
}

fun verifyUser(event: Event, user: User?) {
    if (user == null || event.createdBy != user.id) {
        throw UnauthorizedException("Bruker er ikke autorisert")
    }
}
