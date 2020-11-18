package com.gruppe7.utils

import com.gruppe7.model.Event
import com.gruppe7.model.User
import com.gruppe7.utils.exceptions.UnauthorizedException
import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
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

fun validateGenerateGroupData(filterInformation: ArrayList<FilterInformation>, participantList: ArrayList<Participant>) {
    val generalInfo = filterInformation.find { it.name == null }
        ?: throw java.lang.IllegalArgumentException("Filter for gruppene generelt er ikke sendt med")
    var leastMinimumPerGroup = 0
    val groups: ArrayList<String> = ArrayList()
    for (filter in filterInformation) {
        if (filter.name != null) leastMinimumPerGroup += filter.minimum

        if (filter.maximum == 0) filter.maximum = generalInfo.maximum

        if (filter.maximum < 0 || filter.minimum < 0) throw java.lang.IllegalArgumentException("Negative tall er ikke tillatt")

        if (filter.maximum > 0 && filter.minimum > filter.maximum) throw java.lang.IllegalArgumentException("Maksimum kan ikke være større enn minimum")

        if (!groups.contains(filter.name)) filter.name?.let { groups.add(it) }
    }

    if (leastMinimumPerGroup > generalInfo.minimum) throw java.lang.IllegalArgumentException("Minimum deltagere per gruppe må være større eller lik summen av alle minimum i hvert filter")

    for (participant in participantList) {
        if (!groups.contains(participant.group)) throw java.lang.IllegalArgumentException("${participant.group} har ikke et filter")
    }
}
