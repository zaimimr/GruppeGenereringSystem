package com.gruppe7.utils.types

data class LoginCredentials(val email: String, val password: String)

data class RegistrationData(
    val name: String,
    val email: String,
    val password: String,
)
