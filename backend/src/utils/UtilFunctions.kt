package com.gruppe7.utils

import io.github.cdimascio.dotenv.dotenv

val dotenv = dotenv {
    ignoreIfMalformed = true
    ignoreIfMissing = true
}
fun getSystemVariable(variableKey: String): String? {
    val systemVariable = System.getenv(variableKey) ?: dotenv[variableKey]
    if (systemVariable != null) return systemVariable
    throw NullPointerException()
}
